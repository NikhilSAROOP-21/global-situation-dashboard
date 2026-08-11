ME.md


Global Situation Dashboard — Local Edge AI Models
<div align="center">







ICE Task 3 implementation of deterministic, probabilistic and Tencent R3-Skill-assisted local AI for the Global Situation Dashboard.

</div>

Student Information
Student: Nikhil Saroop

Student number: ST10040092

Programme: Postgraduate Diploma in Data Analytics

Module: PDAN8412 — Programming for Data Analytics 2

Assessment: ICE Task 3 — Edge AI on the Global Awareness Dashboard

Original project: The-ProfessorGG/global-situation-dashboard

Student fork: NikhilSAROOP-21/global-situation-dashboard

Project Overview
The dashboard provides a local, interactive view of global events such as cyber threats, earthquakes, volcanoes, aviation activity, maritime activity and other intelligence feeds.

The original React and Vite dashboard was extended with three selectable local AI modes.

All model inference runs on the local computer.

No cloud-hosted AI API is used.

Dashboard information is cleaned before it is sent to the local model so that large Three.js rendering objects are excluded.

Assessment Models
Model A — Deterministic
Uses the local llama3.1 model through Ollama.

Uses temperature 0, top_k: 1, top_p: 1 and fixed seed 42.

The same question and unchanged dashboard snapshot should produce the same response.

Provides consistent analyst-style answers for repeatable testing.

Model B — Probabilistic
Uses the same local llama3.1 model through Ollama.

Uses temperature 0.8, top_k: 40, top_p: 0.9 and a randomly generated seed.

Repeated runs can produce different wording because token sampling is enabled.

Demonstrates the effect of controlled randomness in generative modelling.

Model C — Tencent R3-Skill
Uses Tencent R3-Skill as a local routing model.

Uses an embedding model to retrieve relevant analyst skills.

Uses a reranker to select the best specialist skill for the question.

Passes the selected specialist guidance to the local llama3.1 model.

Uses deterministic Llama generation after routing.

Displays the selected skill, routing score and processing device in the dashboard.

The R3 service was verified using CUDA on cuda:0.

Model C does not generate the final answer by itself. Tencent R3-Skill selects the most relevant analyst role, while the local Llama 3.1 model produces the final dashboard-based response.

Required Model Distinction Note
Model A is deterministic because it uses temperature 0, greedy-style selection and a fixed seed, so an unchanged input should produce the same output. Model B is probabilistic because it uses temperature 0.8, sampling parameters and a changing random seed, allowing repeated runs to differ. Model C uses Tencent R3-Skill locally to select the most relevant analyst skill before the local Llama 3.1 model generates the response.

Model C Analyst Skills
The R3 router can select from nine dashboard-specific roles:

Global Risk Analyst

Cyber Threat Analyst

Disaster Analyst

Aviation Analyst

Maritime Analyst

Space Operations Analyst

Network Intelligence Analyst

Threat Correlation Analyst

Feed Health Analyst

Local Architecture
React dashboard (port 5173)
        |
        v
Node AI backend (port 5050)
        |
        |---- Model A/B ----> Ollama + Llama 3.1 (port 11434)
        |
        |---- Model C ------> Tencent R3-Skill service (port 6060)
                               |
                               v
                         Selected analyst skill
                               |
                               v
                         Ollama + Llama 3.1
Repository Structure
global-situation-dashboard
├── public
├── server
│   └── index.js
├── src
│   ├── assets
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── model-c-r3
│   ├── .venv                  # Local only; excluded from Git
│   └── R3-Skill
│       ├── data
│       ├── models             # Local weights; excluded from Git
│       ├── dashboard_skills.jsonl
│       ├── infer.py
│       ├── r3_service.py
│       ├── requirements.txt
│       └── README.md
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
Requirements
Git

Node.js 20 or later

npm

Ollama

Local Ollama model: llama3.1

Python 3.13

Tencent R3-Skill dependencies

NVIDIA GPU and CUDA are optional but recommended for Model C

Installation
1. Clone the Student Fork
git clone https://github.com/NikhilSAROOP-21/global-situation-dashboard.git
cd global-situation-dashboard
2. Install Frontend and Node Dependencies
npm install
3. Pull the Local Llama Model
ollama pull llama3.1
Confirm that the model is installed:

ollama list
4. Create the Model C Python Environment
py -3.13 -m venv .\model-c-r3\.venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\model-c-r3\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r .\model-c-r3\R3-Skill\requirements.txt
5. Prepare Tencent R3-Skill
Follow the included model-c-r3/R3-Skill/README.md instructions for the official Tencent R3-Skill setup.

Place the local embedding weights in model-c-r3/R3-Skill/models/r3-embedding.

Place the local reranker weights in model-c-r3/R3-Skill/models/r3-reranker.

Keep model weights out of Git because they are large and reproducible from the official source.

Running the Complete Project
The following four services must remain running in separate VS Code terminals.

Terminal 1 — Start Ollama
ollama serve
Ollama listens on:

http://127.0.0.1:11434
Terminal 2 — Start Tencent R3-Skill
Run this from the repository root:

& ".\model-c-r3\.venv\Scripts\python.exe" ".\model-c-r3\R3-Skill\r3_service.py"
Model C listens on:

http://127.0.0.1:6060
Health check:

http://127.0.0.1:6060/api/health
Terminal 3 — Start the Node AI Backend
node .\server\index.js
The backend listens on:

http://localhost:5050
Health check:

http://localhost:5050/api/health
The message Cannot GET / at http://localhost:5050/ is expected because the backend exposes API routes rather than a home page.

Terminal 4 — Start the Dashboard
npm run dev
Open:

http://localhost:5173
API Routes
Node Backend
GET /api/health — checks the Node AI backend and lists available modes.

POST /api/assistant — processes a dashboard question using Model A, B or C.

Tencent R3-Skill Service
GET /api/health — confirms the R3 models, device and number of skills.

POST /api/route — returns the selected analyst skill and ranked candidates.

Testing the Models
Model A Test
Select Model A - Deterministic.

Enter the following question:

Give a two-sentence summary of the current global risk level.
Run it twice while the dashboard snapshot remains unchanged.

Confirm temperature 0, seed 42 and matching output.

Model B Test
Select Model B - Probabilistic.

Enter the same question used for Model A.

Run it twice.

Confirm temperature 0.8, changing seeds and differences in wording.

Model C Tests
Global-risk routing:

What is causing the current global risk level?
Expected selected skill: Global Risk Analyst

Cyber-threat routing:

Which critical CVE requires urgent investigation?
Expected selected skill: Cyber Threat Analyst

Disaster routing:

Summarise the most significant earthquakes and volcanoes currently shown.
Expected selected skill: Disaster Analyst

Verified Local Results
The dashboard loads successfully at port 5173 and displays live-style global events.

The Node backend exposes deterministic, probabilistic and R3 modes.

Model A returns dashboard-aware deterministic responses.

Model B uses sampling and a changing random seed.

Model C successfully selected Global Risk Analyst for a global-risk question.

Model C successfully selected Cyber Threat Analyst for a critical-CVE question.

Model C reported its device as cuda:0 during testing.

Because dashboard feeds can change between requests, deterministic comparisons should use the same question and an unchanged dashboard snapshot.

Privacy and Local Processing
All AI inference runs locally.

No external cloud AI service is called.

Ollama runs on the local machine.

Tencent R3-Skill runs through a local Python service.

The dashboard snapshot is filtered before inference.

Three.js geometry, materials, matrices and private rendering properties are removed from the model input.

Troubleshooting
Dashboard does not load
npm run dev
Then open http://localhost:5173.

The interface says it cannot connect to the local AI assistant
node .\server\index.js
Confirm http://localhost:5050/api/health returns JSON.

Model C is unavailable
& ".\model-c-r3\.venv\Scripts\python.exe" ".\model-c-r3\R3-Skill\r3_service.py"
Confirm http://127.0.0.1:6060/api/health returns JSON.

Ollama does not respond
ollama serve
Then confirm the model exists:

ollama list
Backend page shows Cannot GET /
Use the health endpoint instead:

http://localhost:5050/api/health
Final Validation
Run the production build before submission:

npm run build
Check the files that will be committed:

git status
Commit and push the completed work:

git add .
git commit -m "Complete local AI models for ICE Task 3"
git push origin master
Attribution
The dashboard is based on the open-source Global Situation Dashboard created by The-ProfessorGG.

The local AI extension, deterministic/probabilistic controls, dashboard-data cleaning, Tencent R3-Skill routing service and three-model user interface were added for this assessment.

Tencent R3-Skill remains subject to its original project licence and attribution requirements.

The original dashboard is distributed under the MIT License.

Submission
Submit the following GitHub repository link:

https://github.com/NikhilSAROOP-21/global-situation-dashboard

<div align="center">

Prepared for PDAN8412 — Programming for Data Analytics 2.

</div>