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

    # =====================================================================
    #  CATEGORY 5: PRODUCT & DESIGN
    # =====================================================================

    "product manager": {
        "core_skills": [
            "Product Strategy & Vision", "User Research & Customer Discovery",
            "A/B Testing & Experimentation", "Product Roadmapping (Now/Next/Later)",
            "Stakeholder Management & Communication", "Metrics & KPIs (North Star/OKRs)",
            "Wireframing & Prototyping", "Competitive Analysis & Market Research",
            "Go-to-Market Strategy", "User Story & PRD Writing",
            "Prioritization Frameworks (RICE/ICE/MoSCoW)", "Cross-Functional Leadership",
            "Data-Driven Decision Making", "Agile/Scrum Product Ownership",
            "Customer Journey Mapping"
        ],
        "advanced_skills": [
            "Product-Led Growth (PLG)", "Platform & API Product Management",
            "Pricing & Monetization Strategy", "International Product Expansion",
            "AI/ML Product Management", "Enterprise Product Strategy"
        ],
        "tools_and_platforms": [
            "Jira/Linear/Asana", "Figma/Miro", "Amplitude/Mixpanel/Heap",
            "Notion/Confluence", "Productboard/Aha!", "Google Analytics",
            "Hotjar/FullStory", "LaunchDarkly"
        ],
        "evaluation_focus": "product thinking, user empathy, metrics-driven decisions, cross-functional leadership, business outcomes, and strategic prioritization",
        "industry_context": "product management at consumer and enterprise tech companies (Google, Airbnb, Stripe, Salesforce)"
    },

    "ui/ux designer": {
        "core_skills": [
            "Figma/Sketch (Advanced)", "User Research & Interviews",
            "Wireframing & Low/High-Fidelity Prototyping", "Design Systems & Component Libraries",
            "Usability Testing & Heuristic Evaluation", "Information Architecture",
            "Interaction Design & Micro-Interactions", "Visual Design (Typography/Color/Layout)",
            "Accessibility (WCAG 2.1/a11y)", "Responsive & Adaptive Design",
            "User Flows & Journey Mapping", "Design Thinking Methodology",
            "Handoff to Development (Specs/Tokens)", "A/B Testing & Design Validation",
            "Motion Design Principles"
        ],
        "advanced_skills": [
            "Design Strategy & Leadership", "Design Ops & Process Scaling",
            "Voice & Conversational UI", "AR/VR Interface Design",
            "Data Visualization Design", "Cross-Platform Design (Web/iOS/Android)"
        ],
        "tools_and_platforms": [
            "Figma/Sketch/Adobe XD", "Framer/Principle", "Miro/FigJam",
            "Maze/UserTesting", "Zeplin/Abstract", "After Effects/Lottie",
            "Storybook", "Hotjar/FullStory"
        ],
        "evaluation_focus": "design thinking process, user empathy, visual hierarchy, interaction quality, measurable UX improvements, and portfolio case studies",
        "industry_context": "product design at design-led companies (Apple, Airbnb, Stripe, Figma)"
    },

    "technical writer": {
        "core_skills": [
            "Technical Documentation Writing", "API Documentation (OpenAPI/Swagger)",
            "Developer Experience (DX) Writing", "Information Architecture for Docs",
            "Markdown/AsciiDoc/reStructuredText", "Code Samples & Tutorials",
            "Style Guide Adherence (Google/Microsoft)", "Docs-as-Code Workflows",
            "Content Strategy for Documentation", "User-Centric Writing",
            "Version Control (Git) for Docs", "Editing & Proofreading",
            "Diagram & Visual Creation (Mermaid/Draw.io)", "Localization & i18n Writing",
            "Release Notes & Changelogs"
        ],
        "advanced_skills": [
            "Developer Portal Design", "Video Tutorial Production",
            "Documentation Metrics & Analytics", "Content Management Systems",
            "AI-Assisted Documentation", "Open-Source Documentation Leadership"
        ],
        "tools_and_platforms": [
            "Docusaurus/GitBook/ReadTheDocs", "Markdown/MDX", "Swagger/Redoc",
            "Confluence/Notion", "Git/GitHub", "Snagit/Camtasia",
            "Draw.io/Mermaid", "Vale/LanguageTool"
        ],
        "evaluation_focus": "writing clarity, technical accuracy, audience awareness, documentation structure, and developer experience impact",
        "industry_context": "technical writing at developer-focused companies (Stripe, Twilio, Google, AWS)"
    },

    "scrum master": {
        "core_skills": [
            "Scrum Framework (Advanced)", "Sprint Planning & Facilitation",
            "Retrospective Facilitation Techniques", "Backlog Refinement & Grooming",
            "Agile Metrics (Velocity/Burndown/Cycle Time)", "Team Coaching & Mentoring",
            "Impediment Removal & Escalation", "Stakeholder Communication",
            "Kanban & Lean Principles", "Servant Leadership",
            "Conflict Resolution & Mediation", "Continuous Improvement Culture",
            "Release Planning & Coordination", "Cross-Team Dependency Management",
            "Agile Transformation & Change Management"
        ],
        "advanced_skills": [
            "SAFe/LeSS/Nexus (Scaled Agile)", "Organizational Design for Agility",
            "Value Stream Mapping", "OKR Alignment with Agile",
            "Agile Coaching at Scale", "DevOps & Agile Integration"
        ],
        "tools_and_platforms": [
            "Jira/Azure DevOps/Linear", "Confluence/Notion", "Miro/MURAL",
            "Trello", "Monday.com", "Slack/Teams", "Retrium/EasyRetro",
            "Jira Align/Rally"
        ],
        "evaluation_focus": "facilitation quality, team velocity improvement, impediment resolution speed, retrospective action follow-through, and agile maturity progression",
        "industry_context": "Scrum Master/Agile Coach at agile organizations"
    },

    # =====================================================================
    #  CATEGORY 6: BUSINESS & MARKETING
    # =====================================================================

    "business analyst": {
        "core_skills": [
            "Business Requirements Gathering & Documentation", "Process Modeling (BPMN/UML)",
            "Data Analysis & SQL", "Stakeholder Management & Communication",
            "Use Case & User Story Writing", "Gap Analysis & Root Cause Analysis",
            "Wireframing & Mockups (Basic)", "Cost-Benefit Analysis & ROI Calculation",
            "Functional & Non-Functional Requirements", "UAT Planning & Execution",
            "Business Process Reengineering", "SWOT & PESTLE Analysis",
            "Agile/Scrum Methodology", "Change Management & Impact Analysis",
            "Presentation & Report Writing"
        ],
        "advanced_skills": [
            "Enterprise Architecture (TOGAF)", "Business Intelligence Strategy",
            "Vendor Evaluation & Selection", "Digital Transformation Planning",
            "Regulatory Compliance Analysis", "Product Ownership Skills"
        ],
        "tools_and_platforms": [
            "Jira/Confluence", "Visio/Lucidchart/Draw.io", "Excel (Advanced/Macros)",
            "SQL/Power BI/Tableau", "Balsamiq/Axure", "Microsoft Office Suite",
            "ServiceNow", "SharePoint"
        ],
        "evaluation_focus": "requirements elicitation quality, stakeholder management, analytical rigor, process improvement impact, and documentation clarity",
        "industry_context": "business analysis at consulting firms and enterprises (Deloitte, Accenture, McKinsey)"
    },

    "digital marketing specialist": {
        "core_skills": [
            "SEO (On-Page/Off-Page/Technical)", "SEM & PPC (Google Ads/Bing Ads)",
            "Social Media Marketing (Organic/Paid)", "Content Marketing & Strategy",
            "Email Marketing & Automation (Mailchimp/HubSpot)", "Google Analytics & GA4",
            "Conversion Rate Optimization (CRO)", "Marketing Funnel Design",
            "Copywriting & Content Creation", "A/B Testing & Experimentation",
            "Marketing Automation (HubSpot/Marketo)", "Influencer & Partnership Marketing",
            "Brand Strategy & Positioning", "Performance Marketing & ROAS",
            "Video Marketing & YouTube Strategy"
        ],
        "advanced_skills": [
            "Programmatic Advertising", "Marketing Attribution Modeling",
            "Customer Data Platform (CDP) Strategy", "Growth Hacking Techniques",
            "International/Multi-Market Campaigns", "AI-Powered Marketing Tools"
        ],
        "tools_and_platforms": [
            "Google Analytics/GA4", "Google Ads/Meta Ads Manager",
            "HubSpot/Mailchimp/Marketo", "SEMrush/Ahrefs/Moz",
            "Canva/Adobe Creative Suite", "Hootsuite/Buffer/Sprout Social",
            "WordPress/Webflow", "Google Tag Manager"
        ],
        "evaluation_focus": "campaign ROI, traffic growth metrics, conversion optimization results, multi-channel strategy, and data-driven marketing decisions",
        "industry_context": "digital marketing at high-growth and D2C companies"
    },

    "growth hacker": {
        "core_skills": [
            "Growth Experimentation (AARRR/Pirate Metrics)", "A/B & Multivariate Testing",
            "Funnel Optimization & Conversion Rate", "Product Analytics (Amplitude/Mixpanel)",
            "SQL & Data Analysis for Growth", "Viral & Referral Loop Design",
            "Landing Page Optimization", "Email & Lifecycle Marketing",
            "SEO & Content-Led Growth", "Paid Acquisition (Facebook/Google Ads)",
            "User Onboarding Optimization", "Retention & Churn Analysis",
            "Pricing Experimentation", "Growth Modeling & Forecasting",
            "Cross-Functional Collaboration (Product/Engineering/Marketing)"
        ],
        "advanced_skills": [
            "Product-Led Growth (PLG) Strategy", "Marketplace Growth Mechanics",
            "International Expansion Playbooks", "AI/ML for Personalization",
            "Community-Led Growth", "Growth Team Building & Leadership"
        ],
        "tools_and_platforms": [
            "Amplitude/Mixpanel/Heap", "Google Analytics/GA4", "Optimizely/VWO",
            "HubSpot/Customer.io", "SQL/Python for Analysis", "Figma (Rapid Prototyping)",
            "Zapier/Make (Automation)", "LaunchDarkly"
        ],
        "evaluation_focus": "experiment velocity, measurable growth metrics (MoM/YoY), creative acquisition channels, retention improvement, and data-driven iteration speed",
        "industry_context": "growth roles at startups and scale-ups (Dropbox, Slack, Notion, Calendly)"
    },

    "sales engineer": {
        "core_skills": [
            "Technical Product Demonstrations", "Solution Architecture for Clients",
            "Pre-Sales Technical Consultation", "RFP/RFI Response Writing",
            "CRM & Sales Pipeline Management", "Technical Objection Handling",
            "POC (Proof of Concept) Delivery", "API & Integration Knowledge",
            "Industry Domain Expertise", "Competitive Technical Analysis",
            "Customer Success & Relationship Building", "ROI & Business Case Development",
            "Presentation & Public Speaking", "Cross-functional Collaboration (Sales/Product/Engineering)",
            "Technical Documentation for Clients"
        ],
        "advanced_skills": [
            "Enterprise Deal Architecture", "Partner & Channel Technical Enablement",
            "Custom Solution Design at Scale", "Product Feedback Loop to Engineering",
            "Strategic Account Planning", "Technical Community Building"
        ],
        "tools_and_platforms": [
            "Salesforce/HubSpot CRM", "Gong/Chorus (Conversation Intelligence)",
            "Zoom/Teams (Demo Tools)", "Postman/Swagger (API Demos)",
            "Confluence/Notion", "LucidChart/Draw.io", "Slack/Teams",
            "Demo Environments & Sandboxes"
        ],
        "evaluation_focus": "technical demo quality, deal support effectiveness, solution design accuracy, client relationship depth, and revenue impact",
        "industry_context": "sales engineering at enterprise SaaS companies (Salesforce, Snowflake, Datadog, MongoDB)"
    },

    "management consultant": {
        "core_skills": [
            "Strategy & Problem-Solving Frameworks (MECE/Porter's Five Forces)",
            "Business Case Development", "Financial Modeling & Analysis",
            "Stakeholder Management & Executive Communication",
            "Market Sizing & Competitive Landscape Analysis",
            "Data Analysis & Insight Generation", "Project Management & Work Planning",
            "Presentation Design (PowerPoint/Google Slides)", "Process Improvement & Lean Six Sigma",
            "Change Management & Organizational Design", "Industry Research & Benchmarking",
            "Client Relationship Management", "Workshop Facilitation",
            "KPI Design & Performance Measurement", "Risk Assessment & Mitigation"
        ],
        "advanced_skills": [
            "Digital Transformation Strategy", "M&A Due Diligence (Tech)",
            "Operating Model Design", "Pricing & Revenue Strategy",
            "AI/Data Strategy for Enterprises", "Organizational Restructuring"
        ],
        "tools_and_platforms": [
            "PowerPoint/Google Slides", "Excel (Advanced Financial Modeling)",
            "Tableau/Power BI", "Jira/Asana", "Miro/MURAL",
            "Bloomberg/Capital IQ", "Alteryx/SQL", "Notion/Confluence"
        ],
        "evaluation_focus": "structured problem solving, analytical rigor, executive-level communication, measurable client impact, and strategic thinking",
        "industry_context": "management consulting at top firms (McKinsey, BCG, Bain, Deloitte)"
    },

    # =====================================================================
    #  CATEGORY 7: SPECIALIZED ROLES
    # =====================================================================

    "blockchain developer": {
        "core_skills": [
            "Solidity Smart Contract Development", "Ethereum & EVM Ecosystem",
            "Web3.js/Ethers.js", "DeFi Protocols & Tokenomics",
            "Smart Contract Security & Auditing", "Consensus Mechanisms (PoW/PoS/BFT)",
            "Decentralized Application (dApp) Development", "IPFS & Decentralized Storage",
            "Token Standards (ERC-20/ERC-721/ERC-1155)", "Testing (Hardhat/Foundry/Truffle)",
            "Gas Optimization", "Cross-Chain Bridges & Interoperability",
            "Cryptography & Hashing Algorithms", "NFT Marketplace Development",
            "DAO & Governance Systems"
        ],
        "advanced_skills": [
            "Layer 2 Solutions (Rollups/zk-SNARKs)", "MEV & Flash Loans",
            "Formal Verification of Smart Contracts", "Protocol Design",
            "Zero-Knowledge Proof Systems", "Blockchain Scalability Solutions"
        ],
        "tools_and_platforms": [
            "Hardhat/Foundry/Truffle", "OpenZeppelin", "MetaMask/WalletConnect",
            "The Graph (Subgraphs)", "Alchemy/Infura", "Remix IDE",
            "Chainlink (Oracles)", "IPFS/Arweave"
        ],
        "evaluation_focus": "smart contract security, DeFi protocol understanding, gas optimization skills, auditing experience, and on-chain project portfolio",
        "industry_context": "blockchain development at crypto/Web3 companies (Ethereum Foundation, Polygon, Uniswap, Aave)"
    },

    "iot engineer": {
        "core_skills": [
            "Embedded Systems & Microcontrollers", "IoT Communication Protocols (MQTT/CoAP/HTTP)",
            "Sensor Integration & Data Acquisition", "Edge Computing & Processing",
            "Cloud IoT Platforms (AWS IoT/Azure IoT/GCP IoT)", "Firmware Development (C/C++)",
            "Wireless Technologies (BLE/Zigbee/LoRa/Wi-Fi)", "IoT Security & Encryption",
            "Data Pipeline Design (Edge to Cloud)", "Real-Time Operating Systems (RTOS)",
            "PCB Design Basics", "Power Management for IoT Devices",
            "OTA (Over-The-Air) Update Systems", "Device Management & Provisioning",
            "Python/Node.js for IoT Backend"
        ],
        "advanced_skills": [
            "Digital Twin Technology", "Industrial IoT (IIoT) & Industry 4.0",
            "TinyML & Edge AI", "IoT Standards & Interoperability",
            "Fleet Management at Scale", "Predictive Maintenance Systems"
        ],
        "tools_and_platforms": [
            "Raspberry Pi/Arduino/ESP32", "AWS IoT Core/Azure IoT Hub",
            "MQTT Broker (Mosquitto/HiveMQ)", "Node-RED", "Grafana/InfluxDB",
            "PlatformIO/Arduino IDE", "KiCad/Eagle", "ThingsBoard"
        ],
        "evaluation_focus": "end-to-end IoT system design, edge-to-cloud architecture, security implementation, power optimization, and scalable device management",
        "industry_context": "IoT engineering at smart device and industrial companies (Siemens, Bosch, Amazon, Philips)"
    },

    "database administrator": {
        "core_skills": [
            "Database Design & Modeling (ER Diagrams)", "SQL Administration (PostgreSQL/MySQL/Oracle/SQL Server)",
            "Performance Tuning & Query Optimization", "Backup & Recovery Strategies",
            "Replication & High Availability (Master-Slave/Multi-Master)", "Database Security & Access Control",
            "Index Design & Optimization", "Storage Management & Capacity Planning",
            "Migration & Upgrade Planning", "Monitoring & Alerting for Databases",
            "NoSQL Administration (MongoDB/Cassandra/Redis)", "Data Partitioning & Sharding",
            "Transaction Management & Locking", "Disaster Recovery & RTO/RPO",
            "Scripting for DB Automation (SQL/Python/Bash)"
        ],
        "advanced_skills": [
            "Cloud Database Services (RDS/Cloud SQL/Cosmos DB)", "Database Consolidation & Rationalization",
            "In-Memory Databases (Redis/Memcached/VoltDB)", "Time-Series Databases (InfluxDB/TimescaleDB)",
            "Multi-Cloud Database Strategy", "Graph Databases (Neo4j/Neptune)"
        ],
        "tools_and_platforms": [
            "PostgreSQL/MySQL/Oracle/SQL Server", "MongoDB/Cassandra/DynamoDB",
            "Redis/Memcached", "pgAdmin/MySQL Workbench/SSMS", "Percona Toolkit",
            "DataGrip/DBeaver", "Prometheus/Grafana for DB", "Liquibase/Flyway"
        ],
        "evaluation_focus": "database design quality, query performance optimization, high availability design, backup/recovery reliability, and security hardening",
        "industry_context": "DBA roles at data-intensive enterprises and cloud companies"
    },

    "solutions architect": {
        "core_skills": [
            "Enterprise Architecture Design", "Cloud Architecture (AWS/GCP/Azure)",
            "System Integration & Middleware", "API Strategy & Design",
            "Security Architecture & Compliance", "Scalability & Performance Design",
            "Technology Evaluation & Selection", "Stakeholder & Executive Communication",
            "Cost Estimation & TCO Analysis", "Migration & Modernization Planning",
            "High Availability & Disaster Recovery Design", "Microservices vs Monolith Strategy",
            "Data Architecture & Flow Design", "DevOps & CI/CD Strategy",
            "Technical Documentation & Architecture Decision Records (ADRs)"
        ],
        "advanced_skills": [
            "Domain-Driven Design (DDD)", "Event-Driven Architecture at Scale",
            "Multi-Cloud & Hybrid Strategy", "AI/ML Integration Architecture",
            "Regulatory & Compliance Architecture (HIPAA/PCI/GDPR)",
            "Platform Modernization (Legacy to Cloud-Native)"
        ],
        "tools_and_platforms": [
            "AWS/GCP/Azure (Certified Architect)", "Terraform/Pulumi",
            "Lucidchart/Draw.io/Miro", "Kubernetes/Docker", "Kafka/RabbitMQ",
            "API Gateways (Kong/Apigee)", "Confluence/Notion", "ArchiMate/TOGAF"
        ],
        "evaluation_focus": "architectural breadth, technical depth, communication with non-technical stakeholders, trade-off analysis, and enterprise-scale design thinking",
        "industry_context": "solutions architecture at cloud vendors and consulting firms (AWS, Google Cloud, Accenture, Deloitte)"
    },

    "erp consultant": {
        "core_skills": [
            "ERP System Configuration & Customization", "Business Process Mapping (Order-to-Cash/Procure-to-Pay)",
            "Requirements Gathering & Gap Analysis", "Module Expertise (Finance/SCM/HR/Manufacturing)",
            "Data Migration & Integration", "User Training & Change Management",
            "Testing & UAT Coordination", "Report & Dashboard Development",
            "Workflow & Approval Configuration", "System Administration & User Management",
            "Vendor Management & Licensing", "Cut-Over Planning & Go-Live Support",
            "Master Data Management", "Compliance & Regulatory Configuration",
            "Post-Implementation Support & Optimization"
        ],
        "advanced_skills": [
            "ERP Architecture & Multi-Entity Design", "Cloud ERP Migration (On-Prem to Cloud)",
            "Integration Platform Design (iPaaS)", "Advanced Analytics & BI on ERP Data",
            "RPA Integration with ERP", "Global Rollout Management"
        ],
        "tools_and_platforms": [
            "SAP S/4HANA / SAP ECC", "Oracle ERP Cloud / NetSuite",
            "Microsoft Dynamics 365", "Workday", "Infor/Epicor",
            "MuleSoft/Boomi (Integration)", "Power BI/Tableau (Reporting)",
            "ServiceNow"
        ],
        "evaluation_focus": "ERP domain expertise, business process understanding, implementation methodology, change management skills, and measurable client outcomes",
        "industry_context": "ERP consulting at system integrators and enterprises (Deloitte, Accenture, TCS, Infosys)"
    },

    "sap consultant": {
        "core_skills": [
            "SAP Module Expertise (FICO/MM/SD/PP/HCM)", "SAP S/4HANA Configuration",
            "ABAP Programming", "SAP Fiori/UI5 Development",
            "Business Blueprint & Requirements Documentation", "SAP Integration (RFC/BAPI/IDoc/PI-PO)",
            "Data Migration (LSMW/S/4HANA Migration Cockpit)", "SAP Security & Authorization (Roles/Profiles)",
            "Custom Report Development (ALV/Smart Forms/Adobe Forms)", "SAP Testing & Transport Management",
            "Master Data Governance (MDG)", "SAP Solution Manager",
            "Business Process Configuration (IMG)", "SAP Workflow Design",
            "End-User Training & Documentation"
        ],
        "advanced_skills": [
            "SAP BTP (Business Technology Platform)", "SAP Analytics Cloud",
            "SAP Integration Suite / CPI", "Greenfield S/4HANA Implementation",
            "SAP RISE Migration", "SAP Activate Methodology"
        ],
        "tools_and_platforms": [
            "SAP S/4HANA / ECC", "SAP GUI / Fiori Launchpad", "ABAP Workbench / Eclipse ADT",
            "SAP BTP / Cloud Foundry", "SAP Solution Manager / Charm",
            "SAP PI/PO / CPI", "SAP Analytics Cloud", "HP ALM / Tricentis Tosca"
        ],
        "evaluation_focus": "SAP module depth, implementation methodology, ABAP skills, integration expertise, and end-to-end project delivery",
        "industry_context": "SAP consulting at global SIs and enterprises (SAP, Deloitte, Accenture, Capgemini, TCS)"
    },
}


# ---------------------------------------------------------------------------
# KEYWORD MAP — 100+ keyword → role mappings for fuzzy matching
# ---------------------------------------------------------------------------
KEYWORD_MAP = {
    # Software Engineer aliases
    "sde": "software engineer", "swe": "software engineer", "developer": "software engineer",
    "programmer": "software engineer", "coder": "software engineer", "software dev": "software engineer",
    "application developer": "software engineer", "software development": "software engineer",

    # Full Stack aliases
    "full stack": "full stack developer", "fullstack": "full stack developer",
    "mern": "full stack developer", "mean": "full stack developer",
    "full-stack": "full stack developer", "web developer": "full stack developer",

    # Frontend aliases
    "frontend": "frontend developer", "front end": "frontend developer",
    "front-end": "frontend developer", "react developer": "frontend developer",
    "vue developer": "frontend developer", "angular developer": "frontend developer",
    "ui developer": "frontend developer", "web ui": "frontend developer",

    # Backend aliases
    "backend": "backend developer", "back end": "backend developer",
    "back-end": "backend developer", "server side": "backend developer",
    "api developer": "backend developer", "node developer": "backend developer",
    "java developer": "backend developer", "python developer": "backend developer",
    "golang": "backend developer", "go developer": "backend developer",

    # Mobile aliases
    "mobile": "mobile developer", "ios developer": "mobile developer",
    "android developer": "mobile developer", "flutter developer": "mobile developer",
    "react native": "mobile developer", "swift developer": "mobile developer",
    "kotlin developer": "mobile developer", "mobile app": "mobile developer",

    # Data Science aliases
    "data sci": "data scientist", "data science": "data scientist",
    "research scientist": "data scientist",

    # Data Analyst aliases
    "analyst": "data analyst", "data analytics": "data analyst",
    "reporting analyst": "data analyst", "analytics": "data analyst",

    # Data Engineer aliases
    "data eng": "data engineer", "etl developer": "data engineer",
    "data pipeline": "data engineer", "big data": "data engineer",
    "spark developer": "data engineer",

    # ML Engineer aliases
    "ml": "machine learning engineer", "ml engineer": "machine learning engineer",
    "mle": "machine learning engineer", "machine learning": "machine learning engineer",
    "deep learning engineer": "machine learning engineer",

    # AI Research aliases
    "ai research": "ai research scientist", "research": "ai research scientist",
    "ai scientist": "ai research scientist",

    # AI/NLP/CV Engineer aliases
    "ai engineer": "machine learning engineer", "ai developer": "machine learning engineer",
    "nlp": "nlp engineer", "natural language": "nlp engineer",
    "llm engineer": "nlp engineer", "chatbot developer": "nlp engineer",
    "computer vision": "computer vision engineer", "cv engineer": "computer vision engineer",
    "image processing": "computer vision engineer", "perception engineer": "computer vision engineer",

    # BI Analyst aliases
    "bi analyst": "business intelligence analyst", "bi developer": "business intelligence analyst",
    "tableau developer": "business intelligence analyst", "power bi": "business intelligence analyst",
    "reporting": "business intelligence analyst",

    # DevOps aliases
    "devops": "devops engineer", "dev ops": "devops engineer",
    "infrastructure engineer": "devops engineer", "ci/cd": "devops engineer",
    "release engineer": "devops engineer", "build engineer": "devops engineer",

    # Cloud Architect aliases
    "cloud": "cloud architect", "cloud engineer": "cloud architect",
    "aws architect": "cloud architect", "azure architect": "cloud architect",
    "gcp architect": "cloud architect", "cloud consultant": "cloud architect",

    # SRE aliases
    "sre": "site reliability engineer", "reliability": "site reliability engineer",
    "site reliability": "site reliability engineer",

    # Platform Engineer aliases
    "platform": "platform engineer", "platform eng": "platform engineer",
    "developer platform": "platform engineer",

    # Network Engineer aliases
    "network": "network engineer", "network admin": "network engineer",
    "ccna": "network engineer", "ccnp": "network engineer",

    # Security aliases
    "security": "cybersecurity analyst", "cyber": "cybersecurity analyst",
    "soc analyst": "cybersecurity analyst", "infosec": "cybersecurity analyst",
    "information security": "cybersecurity analyst",
    "security engineer": "security engineer", "appsec": "security engineer",
    "application security": "security engineer", "devsecops": "security engineer",
    "pentester": "penetration tester", "pen tester": "penetration tester",
    "ethical hacker": "penetration tester", "offensive security": "penetration tester",
    "red team": "penetration tester",

    # Product Manager aliases
    "product": "product manager", "pm": "product manager",
    "product owner": "product manager", "apm": "product manager",
    "associate product manager": "product manager", "tpm": "product manager",
    "technical program manager": "product manager",

    # UI/UX Designer aliases
    "designer": "ui/ux designer", "ux": "ui/ux designer", "ui": "ui/ux designer",
    "ux designer": "ui/ux designer", "ui designer": "ui/ux designer",
    "product designer": "ui/ux designer", "visual designer": "ui/ux designer",
    "interaction designer": "ui/ux designer", "ux researcher": "ui/ux designer",

    # Technical Writer aliases
    "tech writer": "technical writer", "documentation": "technical writer",
    "content developer": "technical writer", "api writer": "technical writer",

    # Scrum Master aliases
    "scrum": "scrum master", "agile coach": "scrum master",
    "agile": "scrum master", "scrum master": "scrum master",

    # Business Analyst aliases
    "business analyst": "business analyst", "ba": "business analyst",
    "systems analyst": "business analyst", "requirements analyst": "business analyst",
    "functional analyst": "business analyst",

    # Digital Marketing aliases
    "marketing": "digital marketing specialist", "digital marketing": "digital marketing specialist",
    "seo specialist": "digital marketing specialist", "sem": "digital marketing specialist",
    "social media": "digital marketing specialist", "content marketing": "digital marketing specialist",
    "performance marketing": "digital marketing specialist",

    # Growth aliases
    "growth": "growth hacker", "growth marketer": "growth hacker",
    "growth pm": "growth hacker", "growth analyst": "growth hacker",

    # Sales Engineer aliases
    "sales engineer": "sales engineer", "pre-sales": "sales engineer",
    "presales": "sales engineer", "solutions consultant": "sales engineer",
    "technical account manager": "sales engineer",

    # Management Consultant aliases
    "consultant": "management consultant", "management consulting": "management consultant",
    "strategy consultant": "management consultant",

    # Embedded aliases
    "embedded": "embedded systems engineer", "firmware": "embedded systems engineer",
    "embedded software": "embedded systems engineer", "rtos": "embedded systems engineer",

    # Game Dev aliases
    "game": "game developer", "game dev": "game developer",
    "unity developer": "game developer", "unreal developer": "game developer",
    "game programmer": "game developer",

    # QA aliases
    "qa": "qa engineer", "tester": "qa engineer", "sdet": "qa engineer",
    "test engineer": "qa engineer", "quality assurance": "qa engineer",
    "test automation": "qa engineer", "qa analyst": "qa engineer",

    # Blockchain aliases
    "blockchain": "blockchain developer", "web3": "blockchain developer",
    "smart contract": "blockchain developer", "solidity": "blockchain developer",
    "defi": "blockchain developer", "crypto": "blockchain developer",

    # IoT aliases
    "iot": "iot engineer", "internet of things": "iot engineer",
    "smart devices": "iot engineer",

    # DBA aliases
    "dba": "database administrator", "database admin": "database administrator",
    "db admin": "database administrator", "database": "database administrator",

    # Solutions Architect aliases
    "solutions architect": "solutions architect", "architect": "solutions architect",
    "technical architect": "solutions architect", "enterprise architect": "solutions architect",

    # ERP/SAP aliases
    "erp": "erp consultant", "erp consultant": "erp consultant",
    "oracle erp": "erp consultant", "dynamics": "erp consultant",
    "sap": "sap consultant", "sap consultant": "sap consultant",
    "abap": "sap consultant", "sap fico": "sap consultant",
    "sap mm": "sap consultant", "sap sd": "sap consultant",
    "s4hana": "sap consultant", "sap hana": "sap consultant",
}


def get_role_profile(job_role: str) -> dict:
    """Match the user's job role input to the closest profile.

    Resolution order:
    1. Exact match against ROLE_PROFILES keys
    2. Partial/substring match against ROLE_PROFILES keys
    3. Keyword match against KEYWORD_MAP
    4. Fallback to 'default' profile
    """
    role_lower = job_role.lower().strip()

    # 1. Direct match
    if role_lower in ROLE_PROFILES:
        return ROLE_PROFILES[role_lower]

    # 2. Partial match (bidirectional substring)
    for key, profile in ROLE_PROFILES.items():
        if key in role_lower or role_lower in key:
            return profile

    # 3. Keyword match (longest keyword first for accuracy)
    sorted_keywords = sorted(KEYWORD_MAP.keys(), key=len, reverse=True)
    for keyword in sorted_keywords:
        if keyword in role_lower:
            mapped_role = KEYWORD_MAP[keyword]
            if mapped_role in ROLE_PROFILES:
                return ROLE_PROFILES[mapped_role]

    # 4. Fallback
    return ROLE_PROFILES["default"]
