"""
Comprehensive Role Profiles Database for SkillMatrix Pro.
Each role contains core skills, advanced skills, tools/platforms,
evaluation focus, and industry context for world-class resume analysis.
"""


# ---------------------------------------------------------------------------
# ROLE PROFILES — 35+ roles across 7 industry categories
# ---------------------------------------------------------------------------
ROLE_PROFILES = {

    # ===== DEFAULT =====
    "default": {
        "core_skills": [
            "Communication", "Problem Solving", "Teamwork", "Adaptability",
            "Critical Thinking", "Time Management", "Leadership",
            "Project Management", "Analytical Skills", "Presentation Skills",
            "Conflict Resolution", "Decision Making"
        ],
        "advanced_skills": [
            "Strategic Planning", "Change Management", "Cross-functional Collaboration",
            "Stakeholder Management", "Mentoring & Coaching"
        ],
        "tools_and_platforms": [
            "Microsoft Office Suite", "Google Workspace", "Slack/Teams",
            "Jira/Asana", "Confluence/Notion"
        ],
        "evaluation_focus": "general professional competence, transferable skills, and career trajectory",
        "industry_context": "general industry across multiple domains"
    },

    # =====================================================================
    #  CATEGORY 1: ENGINEERING
    # =====================================================================

    "software engineer": {
        "core_skills": [
            "Data Structures & Algorithms", "System Design", "Object-Oriented Programming",
            "REST API Design", "Git/Version Control", "SQL & Relational Databases",
            "NoSQL Databases", "Testing & TDD", "CI/CD Pipelines",
            "Cloud Computing (AWS/GCP/Azure)", "Microservices Architecture",
            "Concurrency & Multithreading", "Design Patterns",
            "Code Review & Best Practices", "Agile/Scrum Methodology"
        ],
        "advanced_skills": [
            "Distributed Systems", "Event-Driven Architecture", "Performance Profiling",
            "Capacity Planning", "Tech Lead / Architecture Ownership",
            "Open Source Contributions", "Domain-Driven Design"
        ],
        "tools_and_platforms": [
            "GitHub/GitLab", "Docker", "Kubernetes", "Jenkins/GitHub Actions",
            "PostgreSQL/MySQL", "Redis", "Kafka", "Terraform", "New Relic/Datadog"
        ],
        "evaluation_focus": "coding proficiency, system design thinking, scalable architecture, code quality, engineering rigor, and production-level software delivery",
        "industry_context": "software engineering at top tech companies (Google, Meta, Apple, Amazon, Microsoft)"
    },

    "frontend developer": {
        "core_skills": [
            "JavaScript (ES6+)", "TypeScript", "React.js", "HTML5 & Semantic HTML",
            "CSS3 / SASS / LESS", "Responsive & Mobile-First Design",
            "State Management (Redux/Zustand/Context)", "RESTful API Integration",
            "Web Performance Optimization", "Cross-Browser Compatibility",
            "Accessibility (WCAG/a11y)", "Component-Based Architecture",
            "Webpack/Vite Build Tools", "Unit & E2E Testing (Jest/Cypress)",
            "Browser DevTools & Debugging"
        ],
        "advanced_skills": [
            "Server-Side Rendering (Next.js)", "Micro-Frontends",
            "Design System Development", "Web Animations (GSAP/Framer Motion)",
            "Progressive Web Apps (PWA)", "Web Security (XSS/CSRF prevention)",
            "GraphQL Client Integration"
        ],
        "tools_and_platforms": [
            "React/Vue/Angular", "Next.js/Nuxt.js", "Storybook",
            "Figma (Design Handoff)", "npm/yarn/pnpm", "Vercel/Netlify",
            "Lighthouse", "Sentry", "Chromatic"
        ],
        "evaluation_focus": "UI/UX sensibility, component architecture, performance optimization, accessibility compliance, modern frontend patterns, and pixel-perfect implementation",
        "industry_context": "frontend engineering at design-forward companies (Airbnb, Stripe, Vercel, Shopify)"
    },

    "backend developer": {
        "core_skills": [
            "Server-Side Programming (Node.js/Python/Java/Go)",
            "REST API Design & Development", "GraphQL API Design",
            "Database Design (SQL & NoSQL)", "Authentication & Authorization (OAuth/JWT)",
            "Caching Strategies (Redis/Memcached)", "Message Queues (RabbitMQ/Kafka)",
            "Microservices Architecture", "Docker & Containerization",
            "API Security & Rate Limiting", "ORM Frameworks (Sequelize/SQLAlchemy/Hibernate)",
            "Error Handling & Logging", "Database Indexing & Query Optimization",
            "Webhook & Event-Driven Design", "Load Balancing & Reverse Proxy"
        ],
        "advanced_skills": [
            "Distributed Systems & CAP Theorem", "CQRS & Event Sourcing",
            "Database Sharding & Replication", "Service Mesh (Istio)",
            "gRPC & Protocol Buffers", "Serverless Architecture",
            "Multi-Tenancy Design"
        ],
        "tools_and_platforms": [
            "Express/FastAPI/Spring Boot/Gin", "PostgreSQL/MongoDB/DynamoDB",
            "Redis", "Kafka/RabbitMQ", "Docker/Kubernetes",
            "Nginx/HAProxy", "Elasticsearch", "Prometheus/Grafana", "Swagger/OpenAPI"
        ],
        "evaluation_focus": "API design quality, database optimization, scalability patterns, security best practices, distributed systems thinking, and high-availability architecture",
        "industry_context": "backend engineering at high-scale companies (Netflix, Uber, Stripe, Twilio)"
    },

    "full stack developer": {
        "core_skills": [
            "JavaScript/TypeScript (Full Stack)", "React/Vue/Angular (Frontend)",
            "Node.js/Python/Java (Backend)", "REST & GraphQL APIs",
            "SQL & NoSQL Databases", "HTML5/CSS3/SASS",
            "Authentication (OAuth/JWT/Session)", "Git & Version Control",
            "Responsive Design", "State Management",
            "Docker & Basic DevOps", "Testing (Unit/Integration/E2E)",
            "CI/CD Pipelines", "Cloud Deployment (AWS/GCP/Vercel)",
            "WebSocket & Real-Time Communication"
        ],
        "advanced_skills": [
            "Server-Side Rendering (Next.js/Nuxt)", "Monorepo Management",
            "Performance Optimization (Frontend + Backend)", "Infrastructure as Code",
            "Microservices vs Monolith Decision-Making", "Technical Architecture"
        ],
        "tools_and_platforms": [
            "MERN/MEAN/MEVN Stack", "Next.js/Remix", "Prisma/Drizzle ORM",
            "Docker Compose", "Vercel/Railway/Render", "Supabase/Firebase",
            "Tailwind CSS", "Postman/Insomnia"
        ],
        "evaluation_focus": "end-to-end development capability, architectural decision making, breadth vs depth balance, deployment skills, and ability to ship complete features independently",
        "industry_context": "full stack roles at startups and mid-size tech companies"
    },

    "mobile developer": {
        "core_skills": [
            "React Native / Flutter / Swift / Kotlin",
            "Mobile UI/UX Design Patterns", "State Management (Provider/BLoC/Redux)",
            "RESTful & GraphQL API Integration", "Local Storage & SQLite",
            "Push Notifications (FCM/APNs)", "App Lifecycle Management",
            "Responsive Layouts & Adaptive UI", "Mobile Performance Optimization",
            "App Store Deployment (iOS/Android)", "Offline-First Architecture",
            "Deep Linking & Navigation", "Mobile Security Best Practices",
            "Unit & Widget Testing", "Crash Analytics & Monitoring"
        ],
        "advanced_skills": [
            "Native Module Bridging", "Custom Animations & Gestures",
            "Background Processing & Services", "Bluetooth/NFC Integration",
            "AR/VR SDKs (ARKit/ARCore)", "CI/CD for Mobile (Fastlane/Bitrise)"
        ],
        "tools_and_platforms": [
            "Xcode/Android Studio", "Flutter/React Native/SwiftUI/Jetpack Compose",
            "Firebase", "Fastlane", "TestFlight/Play Console",
            "Crashlytics/Sentry", "Figma", "CocoaPods/Gradle"
        ],
        "evaluation_focus": "platform-specific expertise, mobile UX quality, app performance, offline capabilities, and cross-platform decision-making",
        "industry_context": "mobile engineering at consumer-facing apps (Instagram, Spotify, Airbnb)"
    },

    "embedded systems engineer": {
        "core_skills": [
            "C/C++ Programming", "Microcontroller Programming (ARM/AVR/PIC)",
            "RTOS (FreeRTOS/Zephyr)", "Hardware-Software Interface Design",
            "Communication Protocols (I2C/SPI/UART/CAN)", "PCB Design Basics",
            "Firmware Development", "Memory Management (Bare-Metal)",
            "Debugging (JTAG/SWD/Logic Analyzer)", "Power Management & Optimization",
            "Interrupt Handling & Timers", "Sensor Integration & Signal Processing",
            "Embedded Linux", "Device Driver Development",
            "Version Control for Firmware"
        ],
        "advanced_skills": [
            "FPGA Programming (Verilog/VHDL)", "Safety-Critical Systems (ISO 26262)",
            "Over-The-Air (OTA) Updates", "Secure Boot & Hardware Security",
            "Automotive/Medical Device Standards", "RTOS Kernel Internals"
        ],
        "tools_and_platforms": [
            "STM32/ESP32/Arduino", "Keil/IAR/GCC-ARM", "Oscilloscope/Logic Analyzer",
            "Altium/KiCad", "MATLAB/Simulink", "Git for Firmware", "Jenkins for Embedded CI"
        ],
        "evaluation_focus": "low-level programming expertise, hardware understanding, real-time system design, debugging skills, and safety-critical thinking",
        "industry_context": "embedded engineering at automotive, aerospace, and IoT companies (Tesla, Bosch, Qualcomm)"
    },

    "game developer": {
        "core_skills": [
            "Game Engine (Unity/Unreal Engine)", "C#/C++ for Games",
            "3D Mathematics (Linear Algebra/Physics)", "Game Physics & Collision Detection",
            "Shader Programming (HLSL/GLSL)", "Game AI & Pathfinding (A*)",
            "Animation Systems & State Machines", "UI/UX for Games",
            "Multiplayer & Networking (Photon/Mirror)", "Performance Profiling & Optimization",
            "Asset Pipeline Management", "Version Control (Git/Perforce)",
            "Level Design & Scripting", "Audio Integration",
            "Platform-Specific Optimization (PC/Console/Mobile)"
        ],
        "advanced_skills": [
            "Procedural Generation", "Custom Engine Development",
            "Rendering Pipeline Customization", "Memory Pool Management",
            "Cross-Platform Porting", "Live Ops & Game-as-a-Service"
        ],
        "tools_and_platforms": [
            "Unity/Unreal Engine 5", "Blender/Maya", "Photon/PlayFab",
            "Steam SDK/Console SDKs", "FMOD/Wwise", "Perforce/PlasticSCM",
            "Visual Studio/Rider", "RenderDoc/PIX"
        ],
        "evaluation_focus": "game engine expertise, performance optimization, game math skills, multiplayer architecture, and shipped game portfolio",
        "industry_context": "game development at AAA and indie studios (EA, Ubisoft, Riot, Supercell)"
    },

    "qa engineer": {
        "core_skills": [
            "Test Planning & Strategy", "Manual Testing Techniques",
            "Test Automation (Selenium/Cypress/Playwright)", "API Testing (Postman/RestAssured)",
            "Performance Testing (JMeter/k6/Locust)", "Bug Tracking & Reporting (Jira)",
            "SQL for Data Validation", "Regression & Smoke Testing",
            "CI/CD Integration for Tests", "Test Case Design (BVA/Equivalence Partitioning)",
            "Cross-Browser & Cross-Device Testing", "Mobile Testing (Appium)",
            "Agile Testing Methodology", "BDD/TDD Frameworks (Cucumber/Gherkin)",
            "Security Testing Basics (OWASP)"
        ],
        "advanced_skills": [
            "Test Architecture & Framework Design", "Contract Testing (Pact)",
            "Chaos Engineering", "Visual Regression Testing",
            "Load & Stress Testing at Scale", "SDET-level Coding Skills"
        ],
        "tools_and_platforms": [
            "Selenium/Cypress/Playwright", "Postman/Newman", "JMeter/k6",
            "Jira/TestRail/Zephyr", "Appium", "BrowserStack/Sauce Labs",
            "Jenkins/GitHub Actions", "Allure/Extent Reports"
        ],
        "evaluation_focus": "testing methodology, automation skills, defect detection rate, test coverage design, and quality advocacy mindset",
        "industry_context": "QA/SDET roles at quality-focused tech companies"
    },

    # =====================================================================
    #  CATEGORY 2: DATA & AI
    # =====================================================================

    "data scientist": {
        "core_skills": [
            "Python for Data Science", "R Programming",
            "Machine Learning (Supervised/Unsupervised)", "Statistics & Probability",
            "Hypothesis Testing & Experimental Design", "SQL (Advanced Queries)",
            "Data Visualization (Matplotlib/Seaborn/Plotly)", "Pandas & NumPy",
            "Feature Engineering & Selection", "Deep Learning (CNN/RNN/Transformers)",
            "Natural Language Processing", "A/B Testing & Causal Inference",
            "Model Evaluation & Validation (Cross-Validation/ROC-AUC)",
            "Dimensionality Reduction (PCA/t-SNE)", "Time Series Analysis"
        ],
        "advanced_skills": [
            "Bayesian Statistics", "Reinforcement Learning",
            "MLOps & Model Deployment", "Large-Scale Data Processing (Spark)",
            "Research Paper Implementation", "Causal ML / Uplift Modeling",
            "Generative AI & LLM Fine-Tuning"
        ],
        "tools_and_platforms": [
            "Jupyter/Colab", "Scikit-learn", "TensorFlow/PyTorch",
            "Tableau/Power BI", "AWS SageMaker/GCP Vertex AI",
            "MLflow/Weights & Biases", "Spark/Databricks", "Hugging Face"
        ],
        "evaluation_focus": "statistical rigor, ML model selection, experiment design, data storytelling, business impact of analyses, and research-to-production pipeline",
        "industry_context": "data science at top tech and analytics companies (Google, Netflix, Spotify, Airbnb)"
    },

    "data analyst": {
        "core_skills": [
            "SQL (Advanced — Joins/Window Functions/CTEs)", "Excel & Google Sheets (Advanced)",
            "Data Visualization (Tableau/Power BI/Looker)", "Python/R for Analysis",
            "Descriptive & Inferential Statistics", "ETL & Data Pipeline Basics",
            "Business Acumen & Domain Knowledge", "Dashboard Design & Storytelling",
            "A/B Testing & Experimentation", "Data Cleaning & Wrangling",
            "KPI Definition & Tracking", "Cohort & Funnel Analysis",
            "Regression Analysis", "Data Governance & Quality",
            "Stakeholder Reporting & Presentations"
        ],
        "advanced_skills": [
            "Predictive Analytics", "Marketing Mix Modeling",
            "Customer Segmentation (RFM/Clustering)", "Revenue Forecasting",
            "dbt & Modern Data Stack", "Statistical Process Control"
        ],
        "tools_and_platforms": [
            "Tableau/Power BI/Looker", "SQL (BigQuery/Snowflake/Redshift)",
            "Excel/Google Sheets", "Python (Pandas/Matplotlib)", "dbt",
            "Google Analytics/Mixpanel", "Jupyter Notebooks", "Fivetran/Airbyte"
        ],
        "evaluation_focus": "analytical thinking, dashboard design, data-driven decision making, translating data into business insights, and communication with non-technical stakeholders",
        "industry_context": "data analytics at product and e-commerce companies (Amazon, Walmart, Spotify)"
    },

    "data engineer": {
        "core_skills": [
            "Python/Scala/Java for Data", "SQL (Advanced — Performance Tuning)",
            "ETL/ELT Pipeline Design", "Apache Spark & Distributed Computing",
            "Data Warehouse Design (Star/Snowflake Schema)",
            "Stream Processing (Kafka/Flink/Kinesis)", "Cloud Data Services (AWS/GCP/Azure)",
            "Data Modeling & Schema Design", "Orchestration (Airflow/Dagster/Prefect)",
            "Data Quality & Validation Frameworks", "Data Lake Architecture",
            "CDC (Change Data Capture)", "Batch vs Real-Time Processing",
            "Data Governance & Cataloging", "Infrastructure as Code for Data"
        ],
        "advanced_skills": [
            "Lakehouse Architecture (Delta Lake/Iceberg)", "Data Mesh Principles",
            "Cost Optimization for Data Pipelines", "Real-Time ML Feature Pipelines",
            "Multi-Cloud Data Strategy", "Data Privacy Engineering (GDPR/CCPA)"
        ],
        "tools_and_platforms": [
            "Apache Spark/PySpark", "Airflow/Dagster", "Kafka/Confluent",
            "Snowflake/BigQuery/Redshift", "dbt", "Delta Lake/Apache Iceberg",
            "Docker/Kubernetes", "Terraform", "Great Expectations/Soda"
        ],
        "evaluation_focus": "pipeline architecture, data modeling expertise, scalability of data solutions, reliability engineering for data, and cost-efficient infrastructure design",
        "industry_context": "data engineering at data-intensive companies (Uber, Lyft, Netflix, Databricks)"
    },

    "machine learning engineer": {
        "core_skills": [
            "Python (Advanced)", "TensorFlow/PyTorch", "ML Pipeline Design",
            "Model Training & Hyperparameter Tuning", "Feature Engineering at Scale",
            "Model Serving & Inference Optimization", "MLOps (MLflow/Kubeflow/Vertex AI)",
            "Distributed Training (Horovod/DeepSpeed)", "Data Preprocessing at Scale",
            "Model Monitoring & Drift Detection", "Experiment Tracking",
            "Docker & Kubernetes for ML", "A/B Testing for ML Models",
            "SQL & Data Warehousing", "CI/CD for ML Pipelines"
        ],
        "advanced_skills": [
            "LLM Fine-Tuning & RLHF", "Model Compression (Quantization/Pruning/Distillation)",
            "Feature Stores (Feast/Tecton)", "Edge ML Deployment (TensorRT/ONNX)",
            "Multi-Modal Models", "AutoML & Neural Architecture Search",
            "Responsible AI & Fairness Metrics"
        ],
        "tools_and_platforms": [
            "TensorFlow/PyTorch/JAX", "MLflow/W&B/Neptune", "Kubeflow/Vertex AI/SageMaker",
            "Docker/Kubernetes", "Spark/Ray", "Triton Inference Server",
            "Feast/Tecton", "DVC", "Seldon/BentoML"
        ],
        "evaluation_focus": "ML system design, model training at scale, production ML pipelines, model monitoring, bridging research to production, and end-to-end ML lifecycle ownership",
        "industry_context": "ML engineering at AI-first companies (Google DeepMind, OpenAI, Meta AI, Tesla Autopilot)"
    },

    "ai research scientist": {
        "core_skills": [
            "Deep Learning Theory", "Mathematics (Linear Algebra/Calculus/Optimization)",
            "Probability & Statistical Learning Theory", "PyTorch/JAX/TensorFlow",
            "Research Paper Writing (NeurIPS/ICML/ICLR)", "Experiment Design & Ablation Studies",
            "Transformer Architectures", "Generative Models (GANs/VAEs/Diffusion)",
            "Reinforcement Learning", "Computer Vision / NLP / Multimodal",
            "Information Theory", "Benchmarking & Reproducibility",
            "Large-Scale Training Infrastructure", "Literature Review & Survey",
            "Open-Source Research Contributions"
        ],
        "advanced_skills": [
            "Novel Architecture Design", "Self-Supervised Learning",
            "Foundation Model Training", "Theoretical ML Contributions",
            "Multi-Agent Systems", "AI Safety & Alignment"
        ],
        "tools_and_platforms": [
            "PyTorch/JAX", "Weights & Biases", "LaTeX/Overleaf",
            "Hugging Face", "SLURM/HPC Clusters", "Jupyter/Colab",
            "Git/GitHub", "arXiv/Semantic Scholar"
        ],
        "evaluation_focus": "research novelty, publication record, mathematical depth, experimental rigor, and impact on the research community",
        "industry_context": "AI research at top labs (Google DeepMind, OpenAI, Meta FAIR, Microsoft Research)"
    },

    "nlp engineer": {
        "core_skills": [
            "Natural Language Processing Fundamentals", "Transformer Models (BERT/GPT/T5)",
            "Text Classification & Sentiment Analysis", "Named Entity Recognition (NER)",
            "Text Preprocessing (Tokenization/Lemmatization/Stemming)",
            "Word Embeddings (Word2Vec/GloVe/FastText)", "Sequence-to-Sequence Models",
            "Language Model Fine-Tuning", "Information Extraction & Retrieval",
            "Question Answering Systems", "Machine Translation",
            "Regular Expressions & Text Parsing", "Evaluation Metrics (BLEU/ROUGE/F1)",
            "Python (spaCy/NLTK/Hugging Face)", "Prompt Engineering & LLM APIs"
        ],
        "advanced_skills": [
            "RAG (Retrieval-Augmented Generation)", "LLM Fine-Tuning (LoRA/QLoRA)",
            "Multimodal NLP", "Dialogue Systems & Chatbots",
            "Knowledge Graphs & Ontologies", "Low-Resource NLP"
        ],
        "tools_and_platforms": [
            "Hugging Face Transformers", "spaCy/NLTK", "OpenAI/Anthropic APIs",
            "LangChain/LlamaIndex", "Elasticsearch", "PyTorch/TensorFlow",
            "Pinecone/Weaviate/ChromaDB", "Label Studio"
        ],
        "evaluation_focus": "NLP model expertise, text processing pipeline design, LLM integration skills, evaluation methodology, and real-world NLP application delivery",
        "industry_context": "NLP/LLM engineering at AI companies (OpenAI, Cohere, Google, Grammarly)"
    },

    "computer vision engineer": {
        "core_skills": [
            "Image Classification & Object Detection", "CNN Architectures (ResNet/EfficientNet/YOLO)",
            "Image Segmentation (Semantic/Instance/Panoptic)", "OpenCV & Image Processing",
            "Data Augmentation & Preprocessing", "Transfer Learning for Vision",
            "Video Analysis & Tracking", "3D Vision & Point Cloud Processing",
            "Annotation & Labeling Pipelines", "Model Training & Optimization",
            "Edge Deployment (TensorRT/ONNX/CoreML)", "Evaluation Metrics (mAP/IoU)",
            "Python/C++ for Vision", "Camera Calibration & Geometry",
            "GANs for Image Generation"
        ],
        "advanced_skills": [
            "Vision Transformers (ViT/DINO/SAM)", "Self-Supervised Vision",
            "3D Reconstruction & NeRF", "Autonomous Driving Perception",
            "Medical Image Analysis", "Real-Time Inference Optimization"
        ],
        "tools_and_platforms": [
            "PyTorch/TensorFlow", "OpenCV", "YOLO/Detectron2/MMDetection",
            "TensorRT/ONNX Runtime", "Label Studio/CVAT", "Roboflow",
            "Weights & Biases", "NVIDIA DeepStream"
        ],
        "evaluation_focus": "vision model expertise, real-world deployment experience, edge optimization skills, annotation pipeline design, and perception system reliability",
        "industry_context": "computer vision at perception-heavy companies (Tesla, Waymo, Apple, NVIDIA)"
    },

    "business intelligence analyst": {
        "core_skills": [
            "SQL (Advanced Analytical Queries)", "Data Visualization (Tableau/Power BI/Looker)",
            "Dashboard Design & Development", "Business Requirements Gathering",
            "KPI Definition & Metrics Frameworks", "Data Modeling for BI (Star/Snowflake Schema)",
            "ETL Processes & Data Pipelines", "Excel & Spreadsheet Modeling",
            "Report Automation", "Statistical Analysis Basics",
            "Data Quality Assurance", "Stakeholder Communication",
            "Ad-Hoc Analysis & Root Cause Investigation",
            "Self-Service BI Implementation", "Data Governance & Documentation"
        ],
        "advanced_skills": [
            "Predictive Analytics for Business", "Semantic Layer Design",
            "Embedded Analytics", "Real-Time Dashboarding",
            "Advanced DAX/Calculated Fields", "BI Tool Administration"
        ],
        "tools_and_platforms": [
            "Tableau/Power BI/Looker/Qlik", "SQL (Snowflake/BigQuery/Redshift)",
            "dbt", "Excel/Google Sheets", "Alteryx", "SSRS/SSAS",
            "Python (Pandas)", "Fivetran/Stitch"
        ],
        "evaluation_focus": "dashboard design quality, business impact of insights, SQL proficiency, stakeholder communication, and ability to translate data into actionable recommendations",
        "industry_context": "BI roles at enterprise and SaaS companies"
    },

    # =====================================================================
    #  CATEGORY 3: INFRASTRUCTURE & CLOUD
    # =====================================================================

    "devops engineer": {
        "core_skills": [
            "Docker & Containerization", "Kubernetes Orchestration",
            "CI/CD Pipelines (Jenkins/GitHub Actions/GitLab CI)", "Infrastructure as Code (Terraform/Pulumi)",
            "Cloud Platforms (AWS/GCP/Azure)", "Linux System Administration",
            "Monitoring & Observability (Prometheus/Grafana/Datadog)", "Networking (TCP/IP/DNS/Load Balancing)",
            "Security (IAM/Vault/Secrets Management)", "Scripting (Bash/Python/Go)",
            "Configuration Management (Ansible/Chef/Puppet)", "GitOps (ArgoCD/Flux)",
            "Log Management (ELK/Loki)", "Incident Response & On-Call Management",
            "Release Management & Deployment Strategies (Blue-Green/Canary)"
        ],
        "advanced_skills": [
            "Service Mesh (Istio/Linkerd)", "Chaos Engineering (Gremlin/Litmus)",
            "FinOps & Cloud Cost Optimization", "Multi-Cloud Architecture",
            "Platform Engineering & Internal Developer Platforms",
            "Compliance Automation (SOC2/HIPAA)"
        ],
        "tools_and_platforms": [
            "Docker/Kubernetes/Helm", "Terraform/Pulumi", "Jenkins/GitHub Actions/ArgoCD",
            "Prometheus/Grafana/Datadog", "AWS/GCP/Azure", "Ansible/Chef",
            "Vault/Secrets Manager", "ELK Stack/Loki", "PagerDuty/OpsGenie"
        ],
        "evaluation_focus": "infrastructure automation, reliability engineering, deployment pipelines, incident management, cloud architecture, and developer experience improvement",
        "industry_context": "DevOps/Platform engineering at cloud-native companies (Netflix, Spotify, Datadog)"
    },

    "cloud architect": {
        "core_skills": [
            "Multi-Cloud Architecture (AWS/GCP/Azure)", "Cloud-Native Design Patterns",
            "Infrastructure as Code (Terraform/CloudFormation/Pulumi)", "Networking (VPC/Subnets/VPN/Direct Connect)",
            "Identity & Access Management (IAM)", "Serverless Architecture (Lambda/Cloud Functions)",
            "Container Orchestration (EKS/GKE/AKS)", "Database Selection & Architecture",
            "Cost Optimization & FinOps", "High Availability & Disaster Recovery",
            "Security Architecture (Zero Trust/Encryption)", "Migration Strategy (Lift-Shift/Re-architect)",
            "Compliance Frameworks (SOC2/HIPAA/PCI-DSS)", "API Gateway & Service Mesh Design",
            "Performance Engineering & Scalability"
        ],
        "advanced_skills": [
            "Multi-Region Architecture", "Hybrid Cloud Design",
            "Cloud Governance & Landing Zones", "Edge Computing Architecture",
            "Data Residency & Sovereignty", "Well-Architected Framework Reviews"
        ],
        "tools_and_platforms": [
            "AWS/GCP/Azure (Certified)", "Terraform/Pulumi", "Kubernetes/ECS/Fargate",
            "CloudWatch/Stackdriver/Azure Monitor", "Lambda/Cloud Functions/Azure Functions",
            "RDS/DynamoDB/Cloud SQL/Cosmos DB", "CloudFront/Cloud CDN",
            "AWS Organizations/GCP Resource Manager"
        ],
        "evaluation_focus": "architectural decision-making, cost-performance tradeoffs, security-first design, migration planning, and enterprise-scale cloud strategy",
        "industry_context": "cloud architecture at enterprise and hyperscale companies (AWS, Google Cloud, Microsoft Azure)"
    },

    "site reliability engineer": {
        "core_skills": [
            "SRE Principles (SLOs/SLIs/Error Budgets)", "Incident Management & Post-Mortems",
            "Monitoring & Alerting (Prometheus/Grafana/PagerDuty)", "Linux Systems (Advanced)",
            "Distributed Systems Understanding", "Capacity Planning & Load Testing",
            "Automation & Toil Reduction", "Kubernetes & Container Orchestration",
            "Networking & DNS Management", "On-Call Best Practices",
            "Change Management & Release Engineering", "Database Reliability",
            "Performance Profiling & Optimization", "Runbook & Documentation Writing",
            "Scripting (Python/Go/Bash)"
        ],
        "advanced_skills": [
            "Chaos Engineering", "Large-Scale Distributed System Design",
            "Custom Monitoring Solutions", "Traffic Management & Load Balancing at Scale",
            "Reliability Consulting for Product Teams", "Global Infrastructure Management"
        ],
        "tools_and_platforms": [
            "Prometheus/Grafana/Thanos", "PagerDuty/OpsGenie", "Kubernetes/Helm",
            "Terraform", "Elasticsearch/Loki", "Jaeger/Zipkin (Tracing)",
            "Statuspage", "Ansible/Puppet", "Go/Python"
        ],
        "evaluation_focus": "reliability mindset, SLO-driven operations, incident response effectiveness, automation impact, and toil reduction measurables",
        "industry_context": "SRE at hyperscale companies (Google, LinkedIn, Dropbox, Twitter)"
    },

    "platform engineer": {
        "core_skills": [
            "Internal Developer Platform (IDP) Design", "Kubernetes & Cloud-Native Stack",
            "CI/CD Pipeline Architecture", "Infrastructure as Code (Terraform/Crossplane)",
            "Developer Experience (DX) Optimization", "Service Catalog & Self-Service Tooling",
            "GitOps Workflows (ArgoCD/Flux)", "Containerization & Registry Management",
            "Secrets Management & Security Guardrails", "Observability Stack Design",
            "API Design for Platform Services", "Cost Management & Resource Governance",
            "Multi-Tenancy & Namespace Management", "Documentation & Developer Onboarding",
            "Scripting & Automation (Python/Go/Bash)"
        ],
        "advanced_skills": [
            "Backstage / Port Developer Portals", "Custom Kubernetes Operators",
            "Policy as Code (OPA/Kyverno)", "Supply Chain Security (SLSA/Sigstore)",
            "Platform Metrics & Adoption Tracking", "Cloud-Native Buildpacks"
        ],
        "tools_and_platforms": [
            "Kubernetes/Helm/Kustomize", "ArgoCD/Flux", "Terraform/Crossplane",
            "Backstage", "Harbor/ECR/GCR", "Vault/External Secrets Operator",
            "Prometheus/Grafana", "GitHub Actions/Tekton", "OPA/Kyverno"
        ],
        "evaluation_focus": "developer experience design, platform adoption metrics, infrastructure abstraction quality, self-service enablement, and engineering productivity improvement",
        "industry_context": "platform engineering at developer-focused companies (Spotify, Atlassian, Shopify)"
    },

    "network engineer": {
        "core_skills": [
            "TCP/IP & OSI Model", "Routing Protocols (BGP/OSPF/EIGRP)",
            "Switching & VLANs", "Firewall Configuration & Management",
            "VPN Technologies (IPSec/SSL)", "DNS & DHCP Administration",
            "Network Monitoring (SNMP/NetFlow/Wireshark)", "Load Balancing (F5/HAProxy/Nginx)",
            "Wireless Networking (Wi-Fi 6/802.11)", "Network Security & ACLs",
            "SD-WAN & SASE", "Cloud Networking (VPC/Transit Gateway)",
            "Network Automation (Ansible/Netmiko/NAPALM)", "QoS & Traffic Shaping",
            "IPv6 Implementation"
        ],
        "advanced_skills": [
            "Software-Defined Networking (SDN)", "Intent-Based Networking",
            "Multi-Cloud Networking", "Network Function Virtualization (NFV)",
            "Zero Trust Network Architecture", "Large-Scale Data Center Networking"
        ],
        "tools_and_platforms": [
            "Cisco/Juniper/Arista", "Palo Alto/Fortinet/Check Point",
            "Wireshark/tcpdump", "Ansible/Terraform for Network", "SolarWinds/PRTG/Nagios",
            "Meraki/Ubiquiti", "AWS/Azure Networking", "InfoBlox"
        ],
        "evaluation_focus": "network design expertise, troubleshooting methodology, automation adoption, security posture, and scalability planning",
        "industry_context": "network engineering at ISPs, data centers, and enterprise companies (Cisco, Cloudflare, Akamai)"
    },

    # =====================================================================
    #  CATEGORY 4: SECURITY
    # =====================================================================

    "cybersecurity analyst": {
        "core_skills": [
            "Network Security Fundamentals", "SIEM Tools (Splunk/QRadar/Sentinel)",
            "Threat Detection & Analysis", "Incident Response & Handling",
            "Vulnerability Assessment & Scanning", "Security Compliance (GDPR/SOC2/HIPAA/PCI-DSS)",
            "Firewall & IDS/IPS Management", "Cryptography & PKI",
            "Threat Modeling (STRIDE/DREAD)", "Malware Analysis Basics",
            "Security Information & Event Management", "Log Analysis & Forensics",
            "Phishing & Social Engineering Awareness", "Identity & Access Management",
            "Risk Assessment & Management"
        ],
        "advanced_skills": [
            "Threat Hunting (Proactive)", "SOAR Platform Automation",
            "Advanced Persistent Threat (APT) Analysis", "Digital Forensics (DFIR)",
            "Cyber Threat Intelligence (CTI)", "Red Team vs Blue Team Operations"
        ],
        "tools_and_platforms": [
            "Splunk/QRadar/Microsoft Sentinel", "Nessus/Qualys/Rapid7",
            "CrowdStrike/Carbon Black", "Wireshark/tcpdump", "MITRE ATT&CK Framework",
            "Palo Alto/Fortinet", "VirusTotal/Any.run", "TheHive/MISP"
        ],
        "evaluation_focus": "threat detection capability, incident response speed, compliance knowledge, forensic investigation skills, and security awareness program design",
        "industry_context": "cybersecurity at enterprise and fintech companies (CrowdStrike, Palo Alto Networks, banks)"
    },

    "security engineer": {
        "core_skills": [
            "Application Security (OWASP Top 10)", "Secure Code Review",
            "Penetration Testing (Web/Network/API)", "Cloud Security (AWS/GCP/Azure Security Services)",
            "Identity & Access Management (OAuth/SAML/OIDC)", "Secrets Management (Vault/KMS)",
            "Container Security (Falco/Trivy/Aqua)", "CI/CD Security (SAST/DAST/SCA)",
            "Infrastructure Security (Hardening/CIS Benchmarks)", "Network Security (Firewalls/WAF/DDoS)",
            "Security Architecture & Design", "Compliance Engineering (SOC2/HIPAA Automation)",
            "Incident Response Planning", "Logging & Monitoring for Security",
            "Scripting for Security Automation (Python/Go)"
        ],
        "advanced_skills": [
            "Zero Trust Architecture", "Supply Chain Security",
            "Bug Bounty Program Management", "Threat Modeling at Scale",
            "Security Data Engineering", "Red Teaming & Adversary Simulation"
        ],
        "tools_and_platforms": [
            "Burp Suite/ZAP", "Vault/AWS KMS", "Snyk/Dependabot/Trivy",
            "Falco/Sysdig", "Terraform Sentinel/OPA", "Semgrep/SonarQube",
            "AWS Security Hub/GuardDuty", "Okta/Auth0", "Splunk/Datadog Security"
        ],
        "evaluation_focus": "security engineering depth, shift-left security adoption, cloud security architecture, automation of security controls, and incident response readiness",
        "industry_context": "security engineering at tech companies (Google, Netflix, Coinbase, Stripe)"
    },

    "penetration tester": {
        "core_skills": [
            "Web Application Penetration Testing (OWASP)", "Network Penetration Testing",
            "API Security Testing", "Vulnerability Assessment & Exploitation",
            "Social Engineering Techniques", "Wireless Network Testing",
            "Active Directory Exploitation", "Privilege Escalation (Linux/Windows)",
            "Report Writing & Risk Scoring (CVSS)", "Scripting (Python/Bash/PowerShell)",
            "OSINT (Open-Source Intelligence)", "Post-Exploitation Techniques",
            "Cloud Penetration Testing (AWS/Azure/GCP)", "Mobile App Security Testing",
            "Red Team Operations"
        ],
        "advanced_skills": [
            "Custom Exploit Development", "Reverse Engineering & Binary Analysis",
            "Advanced Evasion Techniques", "Physical Security Testing",
            "IoT/OT Penetration Testing", "Purple Team Exercises"
        ],
        "tools_and_platforms": [
            "Burp Suite Pro", "Metasploit/Cobalt Strike", "Nmap/Masscan",
            "Kali Linux", "BloodHound/SharpHound", "Hashcat/John the Ripper",
            "Nessus/OpenVAS", "Wireshark", "OWASP ZAP/Nikto"
        ],
        "evaluation_focus": "offensive security expertise, finding and exploiting real vulnerabilities, methodology and documentation quality, and client communication skills",
        "industry_context": "penetration testing at security firms and red teams (Mandiant, CrowdStrike, NCC Group)"
    },
}
