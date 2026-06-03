"""ChromaDB vector store — embedding and retrieval logic for RAG."""

import os
from pathlib import Path
# pyrefly: ignore [missing-import]
from langchain_community.document_loaders import TextLoader 
# pyrefly: ignore [missing-import]
from langchain_text_splitters import RecursiveCharacterTextSplitter
# pyrefly: ignore [missing-import]
from langchain_chroma import Chroma
# pyrefly: ignore [missing-import]
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings

# Determine paths
BASE_DIR = Path(__file__).resolve().parent
NOTES_DIR = BASE_DIR / "notes"
DB_DIR = BASE_DIR / "db"

def get_vectorstore():
    """Initializes and returns the Chroma vector store."""
    hf_token = os.environ.get("HF_TOKEN")
    if not hf_token:
        print("WARNING: HF_TOKEN environment variable is not set. The knowledge_lookup tool will fail.")
        
    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key=hf_token or "missing_token", 
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    
    # If the DB exists, just load it
    if os.path.exists(DB_DIR):
        return Chroma(persist_directory=str(DB_DIR), embedding_function=embeddings)
        
    # Otherwise, ingest the notes
    print("Initializing RAG vector store for the first time...")
    documents = []
    
    if os.path.exists(NOTES_DIR):
        for file in os.listdir(NOTES_DIR):
            if file.endswith(".txt"):
                file_path = NOTES_DIR / file
                loader = TextLoader(str(file_path))
                documents.extend(loader.load())
                
    if not documents:
        print("Warning: No .txt files found in rag/notes/ to index.")
        # Return empty store
        return Chroma(persist_directory=str(DB_DIR), embedding_function=embeddings)
        
    # Split text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_documents(documents)
    
    # Create and persist store
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=str(DB_DIR)
    )
    return vectorstore

def get_retriever():
    """Returns the retriever configured to fetch top 3 chunks."""
    vectorstore = get_vectorstore()
    return vectorstore.as_retriever(search_kwargs={"k": 3})

# Initialize on import so it's ready to go
if not os.path.exists(DB_DIR):
    get_vectorstore()
