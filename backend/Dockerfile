# 1. Start with a Python environment
FROM python:3.11-slim

# 2. Install "build-essential" and "Rust". 
# This is the "secret sauce" that fixes your tiktoken error.
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    gcc \
    && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# 3. Tell the system where to find the Rust compiler we just installed
ENV PATH="/root/.cargo/bin:${PATH}"

# 4. Set the working directory inside the container
WORKDIR /app

# 5. Copy your requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy all your code from your 'backend' folder into the container
COPY . .

# 7. The command to start your server
# Port 10000 is the default for Render
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]