# Use a lightweight Python image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install system dependencies needed for pandas and other Python libraries
RUN apt-get update && apt-get install -y \
    gcc g++ make libffi-dev libssl-dev \
    libpq-dev libxml2-dev libxslt1-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Run the application
CMD ["python", "main.py"]
