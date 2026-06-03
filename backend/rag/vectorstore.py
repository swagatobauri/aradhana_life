"""FAISS vector store — embedding and retrieval logic for RAG."""

import os
from pathlib import Path
# pyrefly: ignore [missing-import]
from langchain_community.document_loaders import TextLoader 
# pyrefly: ignore [missing-import]
from langchain_text_splitters import RecursiveCharacterTextSplitter
# pyrefly: ignore [missing-import]
from langchain_community.vectorstores import FAISS
# pyrefly: ignore [missing-import]
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings

# Determine paths
BASE_DIR = Path(__file__).resolve().parent
NOTES_DIR = BASE_DIR / "notes"
DB_DIR = BASE_DIR / "faiss_db"

def get_vectorstore():
    """Initializes and returns the FAISS vector store."""
    hf_token = os.environ.get("HF_TOKEN")
    if not hf_token:
        print("WARNING: HF_TOKEN environment variable is not set. The knowledge_lookup tool will fail.")
        
    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key=hf_token or "missing_token", 
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    
    # If the DB exists, just load it
    if os.path.exists(DB_DIR) and os.path.exists(DB_DIR / "index.faiss"):
        return FAISS.load_local(str(DB_DIR), embeddings, allow_dangerous_deserialization=True)
        
    # Otherwise, ingest the notes
    print("Initializing FAISS RAG vector store for the first time...")
    documents = []
    
    if os.path.exists(NOTES_DIR):
        for file in os.listdir(NOTES_DIR):
            if file.endswith(".txt"):
                file_path = NOTES_DIR / file
                loader = TextLoader(str(file_path))
                documents.extend(loader.load())
                
    if not documents:
        print("Warning: No .txt files found in rag/notes/ to index.")
        # Return empty store by mocking a simple text
        return FAISS.from_texts(["Empty knowledge base"], embeddings)
        
    # Split text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_documents(documents)
    
    # Create and persist store
    vectorstore = FAISS.from_documents(
        documents=chunks,
        embedding=embeddings
    )
    vectorstore.save_local(str(DB_DIR))
    return vectorstore

def get_retriever():
    """Returns the retriever configured to fetch top 3 chunks."""
    vectorstore = get_vectorstore()
    return vectorstore.as_retriever(search_kwargs={"k": 3})

# Initialize on import so it's ready to go
if not os.path.exists(DB_DIR) or not os.path.exists(DB_DIR / "index.faiss"):
    get_vectorstore()
