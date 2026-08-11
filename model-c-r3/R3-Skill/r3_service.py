"""
Local HTTP service for Tencent R3-Skill.

The retrieval logic is adapted from Tencent's Apache-2.0-licensed infer.py:
https://github.com/Tencent/R3-Skill/blob/main/infer.py
"""

import json
from pathlib import Path

import numpy as np
import torch
from flask import Flask, jsonify, request
from flask_cors import CORS
from sentence_transformers import CrossEncoder, SentenceTransformer


BASE_DIR = Path(__file__).resolve().parent

SKILLS_PATH = BASE_DIR / "dashboard_skills.jsonl"
EMBEDDING_PATH = BASE_DIR / "models" / "r3-embedding"
RERANKER_PATH = BASE_DIR / "models" / "r3-reranker"

EMBEDDING_INSTRUCTION = (
    "Instruct: Given a user request, retrieve the agent skill that solves it.\n"
    "Query: "
)

RERANKER_INSTRUCTION = (
    "Given a user request, retrieve the agent skill that solves it."
)

DEVICE = "cuda:0" if torch.cuda.is_available() else "cpu"


def load_skills():
    skills = []

    with SKILLS_PATH.open(encoding="utf-8") as skill_file:
        for line in skill_file:
            if line.strip():
                skills.append(json.loads(line))

    if not skills:
        raise RuntimeError(
            "dashboard_skills.jsonl contains no skills."
        )

    return skills


def truncate_body(text, tokenizer, maximum_tokens=4096):
    parts = text.split(" | ", 2)

    if len(parts) < 3:
        return text

    token_ids = tokenizer.encode(
        parts[2],
        add_special_tokens=False,
    )

    if len(token_ids) <= maximum_tokens:
        return text

    shortened_body = tokenizer.decode(
        token_ids[:maximum_tokens],
        skip_special_tokens=True,
    )

    return (
        f"{parts[0]} | {parts[1]} | "
        f"{shortened_body}"
    )


print("Model C device:", DEVICE)
print("Loading dashboard skills...")

SKILLS = load_skills()

SKILL_IDS = [
    skill["id"]
    for skill in SKILLS
]

SKILL_DOCUMENTS = [
    skill["text"]
    for skill in SKILLS
]

print("Loading R3 embedding model...")

EMBEDDING_MODEL = SentenceTransformer(
    str(EMBEDDING_PATH),
    trust_remote_code=True,
    device=DEVICE,
)

EMBEDDING_MODEL.max_seq_length = 4096

SKILL_EMBEDDINGS = EMBEDDING_MODEL.encode(
    SKILL_DOCUMENTS,
    batch_size=9,
    normalize_embeddings=True,
    show_progress_bar=True,
    convert_to_numpy=True,
)

print("Loading R3 reranker model...")

RERANKER_MODEL = CrossEncoder(
    str(RERANKER_PATH),
    trust_remote_code=True,
    device=DEVICE,
)

RERANKER_MODEL.max_length = 4096

TRUNCATED_DOCUMENTS = [
    truncate_body(
        text,
        RERANKER_MODEL.tokenizer,
    )
    for text in SKILL_DOCUMENTS
]


app = Flask(__name__)
CORS(app)


@app.get("/api/health")
def health():
    return jsonify(
        {
            "status": "OK",
            "service": "Tencent R3-Skill",
            "device": DEVICE,
            "cudaAvailable": torch.cuda.is_available(),
            "skillCount": len(SKILLS),
        }
    )


@app.post("/api/route")
def route_question():
    request_body = request.get_json(
        silent=True
    ) or {}

    question = request_body.get(
        "question",
        "",
    )

    if (
        not isinstance(question, str)
        or not question.strip()
    ):
        return jsonify(
            {
                "error": "A question is required."
            }
        ), 400

    question = question.strip()

    try:
        requested_top_k = int(
            request_body.get("topK", 3)
        )
    except (TypeError, ValueError):
        requested_top_k = 3

    recall_n = len(SKILLS)

    top_k = max(
        1,
        min(requested_top_k, recall_n),
    )

    query_embedding = EMBEDDING_MODEL.encode(
        [
            EMBEDDING_INSTRUCTION
            + question
        ],
        normalize_embeddings=True,
        show_progress_bar=False,
        convert_to_numpy=True,
    )

    embedding_scores = (
        query_embedding
        @ SKILL_EMBEDDINGS.T
    )

    recalled_indices = np.argsort(
        -embedding_scores[0]
    )[:recall_n]

    reranker_pairs = [
        (
            question,
            TRUNCATED_DOCUMENTS[index],
        )
        for index in recalled_indices
    ]

    reranker_scores = RERANKER_MODEL.predict(
        reranker_pairs,
        batch_size=9,
        prompt=RERANKER_INSTRUCTION,
        show_progress_bar=False,
        convert_to_numpy=True,
    )

    reranker_scores = np.asarray(
        reranker_scores
    ).reshape(-1)

    final_order = np.argsort(
        -reranker_scores
    )[:top_k]

    candidates = []

    for position in final_order:
        skill_index = int(
            recalled_indices[position]
        )

        skill = SKILLS[skill_index]

        candidates.append(
            {
                "id": SKILL_IDS[skill_index],
                "name": skill["text"].split(
                    " | ",
                    1,
                )[0],
                "text": skill["text"],
                "score": float(
                    reranker_scores[position]
                ),
            }
        )

    return jsonify(
        {
            "question": question,
            "selectedSkill": candidates[0],
            "candidates": candidates,
            "model": "Tencent R3-Skill",
            "device": DEVICE,
        }
    )


if __name__ == "__main__":
    print(
        "Model C service running on "
        "http://127.0.0.1:6060"
    )

    print(
        "Health check: "
        "http://127.0.0.1:6060/api/health"
    )

    app.run(
        host="127.0.0.1",
        port=6060,
        debug=False,
        use_reloader=False,
        threaded=False,
    )