export interface VirtualFile {
  name: string;
  path: string;
  content: string;
  language: "python" | "yaml" | "json" | "typescript" | "markdown" | "sql";
  isDir?: boolean;
}

export const productionSchema: VirtualFile[] = [
  {
    name: "README_PROD.md",
    path: "/production/README_PROD.md",
    language: "markdown",
    content: `# Neura Machine Learning Lab (NMLL Studio) — Scalable Microservices Production Framework

This directory houses the official scalable backend, database schema, AI agents, and orchestration templates configured by Wiroxa for deploying NMLL Studio as a enterprise-grade SaaS machine learning hosting platform.

## Infrastructure Architecture Diagram
\`\`\`
                       [ Browser Clients ]
                              │
                    ┌─────────▼─────────┐
                    │    nginx-ingress  │  (Port 443 / SSL)
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   FastAPI Gateway │  (API Web Services)
                    └─────────┬─────────┘
                              │
            ┌─────────────────┼──────────────────┐
            ▼                 ▼                  ▼
    ┌───────────────┐ ┌───────────────┐  ┌───────────────┐
    │  PostgreSQL   │ │ Redis Broker  │  │ S3 Store      │  (Data / Models / Logs)
    │  (SQLAlchemy)  │ │ (Celery task) │  │ (Ceph/AWS)    │
    └───────────────┘ └───────┬───────┘  └───────────────┘
                              │
            ┌─────────────────┴──────────────────┐
            ▼                                    ▼
    ┌───────────────┐                    ┌───────────────┐
    │ Celery Worker │                    │ Jupyter Pod   │  (Isolated Dynamic
    │ (Long Tasks)  │                    │ Kernel Pods   │   Execution Engines)
    └───────────────┘                    └───────────────┘
\`\`\`

## High-Scalability Orchestration Highlights
1. **Dynamic Jupyter Spawn**: The FastAPI framework requests the Kubernetes Core API (using the \`kubernetes\` Python module) to spin up safe, isolated sandboxed namespace namespaces (\`nmll-kernels-*\`) dynamically per user session.
2. **Celery Task Worker Pipeline**: All intensive training actions, heavy Pandas ETL steps, model evaluations, and explainability calculations are run asynchronously on dedicated GPU/CPU Celery queues backed by Redis storage broker.
3. **Database Layer**: Clean relational tables (Users, Projects, Runs, Datasets, Pipelines, Models) manage MLflow-compatible metadata.`
  },
  {
    name: "main.py",
    path: "/production/backend/main.py",
    language: "python",
    content: `# Neura Machine Learning Lab - Wiroxa FastAPI Gateway Router
from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import uuid
from typing import List

from .database import get_db, Base, engine
from .schemas import ProjectCreate, ProjectSchema, DatasetSchema, ModelCreate
from .models import Project, Dataset, ModelRegistry
from .worker import trigger_training_run

app = FastAPI(
    title="NMLL Studio Platform API",
    description="Scalable machine learning operations engine.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db():
    Base.metadata.create_all(bind=engine)

@app.get("/api/health")
def api_health():
    return {"status": "operational", "engine": "FastAPI V0.115", "workers": "Redis Celery Active"}

@app.post("/api/projects", response_model=ProjectSchema, status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(
        id=str(uuid.uuid4()),
        name=project.name,
        description=project.description,
        pipeline_json=project.pipeline_json or "{}"
      )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.post("/api/projects/{project_id}/train", status_code=status.HTTP_202_ACCEPTED)
def start_experiment_training(
    project_id: str,
    epochs: int = 10,
    lr: float = 0.001,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project context not found")
    
    # Delegate long-standing CPU/GPU task to Celery distributed engine
    task = trigger_training_run.delay(project_id, epochs, lr)
    return {"task_id": task.id, "status": "Queued", "broker": "Redis"}
`
  },
  {
    name: "models.py",
    path: "/production/backend/models.py",
    language: "python",
    content: `# NMLL relational schemas and SQLAlchemy models
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    pipeline_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    datasets = relationship("Dataset", back_populates="project", cascade="all, delete-orphan")
    runs = relationship("TrainingRun", back_populates="project", cascade="all, delete-orphan")


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    file_path = Column(String(300), nullable=False)
    row_count = Column(Integer, default=0)
    col_count = Column(Integer, default=0)
    statistics_json = Column(JSON, default={})
    project_id = Column(String(50), ForeignKey("projects.id"))

    project = relationship("Project", back_populates="datasets")


class TrainingRun(Base):
    __tablename__ = "training_runs"

    id = Column(String(50), primary_key=True, index=True)
    project_id = Column(String(50), ForeignKey("projects.id"))
    status = Column(String(30), default="PENDING") # RUNNING, COMPLETED, FAILED
    epochs_total = Column(Integer, default=10)
    learning_rate = Column(Float, default=0.001)
    metrics_history = Column(JSON, default={}) # Loss, accuracy curve snapshots
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="runs")


class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    version = Column(String(20), default="1.0.0")
    accuracy_score = Column(Float, default=0.0)
    loss_score = Column(Float, default=1.0)
    framework = Column(String(30)) # PyTorch, TensorFlow, Scikit-learn, ONNX
    artifacts_url = Column(String(300))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
`
  },
  {
    name: "worker.py",
    path: "/production/backend/worker.py",
    language: "python",
    content: `# Neura Distributed Celery Training Worker Process
from celery import Celery
import time
import json
import random
from .database import SessionLocal
from .models import TrainingRun, ModelRegistry

celery_app = Celery(
    "tasks",
    broker= "redis://localhost:6379/0",
    backend="redis://localhost:6379/1"
)

@celery_app.task(name="trigger_training_run")
def trigger_training_run(project_id: str, epochs: int, lr: float):
    db = SessionLocal()
    run_id = f"run_{int(time.time())}"
    
    # Store initial model progress
    training_run = TrainingRun(
        id=run_id,
        project_id=project_id,
        status="RUNNING",
        epochs_total=epochs,
        learning_rate=lr,
        metrics_history={"loss": [], "accuracy": []}
    )
    db.add(training_run)
    db.commit()

    loss_history = []
    accuracy_history = []

    # Simulate complex Epoch loop
    for epoch in range(1, epochs + 1):
        time.sleep(1.5) # intensive training pause
        loss_val = 0.8 / (epoch ** 0.5) + random.uniform(-0.02, 0.02)
        acc_val = 0.65 + (0.32 * (1 - 1/epoch)) + random.uniform(-0.01, 0.01)
        
        loss_history.append(round(loss_val, 4))
        accuracy_history.append(round(acc_val, 4))
        
        # Push notification or websocket updates
        print(f"Project [{project_id}] - Epoch {epoch}/{epochs} - Loss: {loss_val:.4f} Acc: {acc_val:.4f}")

    # Finalize runs & save Registry
    training_run.status = "COMPLETED"
    training_run.metrics_history = {
        "loss": loss_history,
        "accuracy": accuracy_history
    }
    
    model_artifact = ModelRegistry(
        id=f"mod_reg_{int(time.time())}",
        name=f"RandomForest_Cascade_{project_id[:5]}",
        version="1.0.0",
        accuracy_score=round(accuracy_history[-1], 4),
        loss_score=round(loss_history[-1], 4),
        framework="Scikit-Learn",
        artifacts_url=f"s3://nmll-studio-store/projects/{project_id}/runs/{run_id}/model.onnx"
    )

    db.add(model_artifact)
    db.commit()
    db.close()
    
    return {"status": "COMPLETED", "final_acc": accuracy_history[-1], "model_registered": model_artifact.name}
`
  },
  {
    name: "docker-compose.yml",
    path: "/production/docker-compose.yml",
    language: "yaml",
    content: `version: '3.8'

services:
  # 1. API Platform Gateway Server
  api-gateway:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:wiroxa_nmll_secure@db:5432/nmll_studio
      - REDIS_URL=redis://redis:6379/0
      - S3_ENDPOINT=http://s3-store:9000
    depends_on:
      - db
      - redis

  # 2. Celery Worker daemon for heavy graphics training model fits
  celery-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: celery -A tasks worker --loglevel=info --concurrency=4
    environment:
      - DATABASE_URL=postgresql://postgres:wiroxa_nmll_secure@db:5432/nmll_studio
      - REDIS_URL=redis://redis:6379/1
    depends_on:
      - redis
      - db

  # 3. Redis Task broker store
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # 4. Postgres relational store
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=wiroxa_nmll_secure
      - POSTGRES_DB=nmll_studio
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # 5. Local S3 Compatible MinIO storage
  s3-store:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=wiroxa_access
      - MINIO_ROOT_PASSWORD=wiroxa_secret_key
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  minio_data:
`
  },
  {
    name: "deployment.yaml",
    path: "/production/kubernetes/deployment.yaml",
    language: "yaml",
    content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nmll-gateway-deployment
  namespace: nmll-studio
  labels:
    app: nmll-gateway
spec:
  replicas: 3 # High Availability gateway scaled endpoints
  selector:
    matchLabels:
      app: nmll-gateway
  template:
    metadata:
      labels:
        app: nmll-gateway
    spec:
      containers:
      - name: nmll-gateway
        image: wiroxa/nmll-platform-gateway:v1.2.0
        imagePullPolicy: Always
        ports:
        - containerPort: 8000
        resources:
          requests:
            cpu: "1"
            memory: "2Gi"
          limits:
            cpu: "2"
            memory: "4Gi"
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: nmll-secrets
              key: database-url
        - name: REDIS_URL
          value: "redis://nmll-redis-service.nmll-studio.svc.cluster.local:6379/0"
---
apiVersion: v1
kind: Service
metadata:
  name: nmll-gateway-service
  namespace: nmll-studio
spec:
  ports:
  - port: 8000
    targetPort: 8000
  selector:
    app: nmll-gateway
  type: ClusterIP
`
  }
];

export const staticProjectFiles: VirtualFile[] = [
  ...productionSchema,
  {
    name: "ml_pipeline.py",
    path: "/workspace/ml_pipeline.py",
    language: "python",
    content: `# Wiroxa AI Machine Learning Pipeline draft
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# 1. Load clinical telemetry metrics
print("Loading heart_disease_telemetry.csv...")
df = pd.read_csv('dataset.csv')

# 2. Clean features and label distributions
print("Pre-processing datasets...")
X = np.random.randn(1024, 10)
y = np.random.randint(0, 2, size=1024)

# 3. Train Test Subsets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Initiate RandomForest model
model = RandomForestClassifier(n_estimators=100, max_depth=12)
print("Initiating ensemble model fitting cycle...")

model.fit(X_train, y_train)

# 5. Accuracy checking
predictions = model.predict(X_test)
acc = accuracy_score(y_test, predictions)
print(f"Final Validation Accuracy: {acc:.4f}")
`
  },
  {
    name: "data_wrangling.sql",
    path: "/workspace/data_wrangling.sql",
    language: "sql",
    content: `-- NMLL SQL Feature Aggregation Script
SELECT 
    p.id AS patient_id,
    p.age,
    p.gender,
    COUNT(t.id) AS readmission_counts,
    AVG(t.systolic_pressure) AS avg_systolic,
    AVG(t.diastolic_pressure) AS avg_diastolic,
    CASE 
        WHEN AVG(t.cholesterol) > 240 THEN 'HIGH'
        WHEN AVG(t.cholesterol) BETWEEN 200 AND 240 THEN 'BORDERLINE'
        ELSE 'NORMAL'
    END AS cholesterol_profile
FROM patients p
JOIN telemetry_logs t ON p.id = t.patient_id
WHERE t.recorded_at >= NOW() - INTERVAL '30 Days'
GROUP BY p.id, p.age, p.gender
HAVING COUNT(t.id) >= 5;
`
  },
  {
    name: "jupyter_block.ipynb",
    path: "/workspace/jupyter_block.ipynb",
    language: "json",
    content: `{
  "cells": [
    {
      "cell_type": "markdown",
      "source": [
        "# Wiroxa NMLL Notebook\\n",
        "Exploring neural models and metrics in place."
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "import numpy as np\\n",
        "print(\"Jupyter Kernel Online\")"
      ]
    }
  ]
}`
  }
];
