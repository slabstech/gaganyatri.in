# Use the latest Ubuntu 24.04 image
FROM ubuntu:24.04

# Set environment variables to avoid interaction during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .
RUN python3 -m venv venv

RUN . venv/bin/activate && \
    pip install --no-cache-dir -r requirements.txt

# Copy your application code into the container
COPY . .

# Command to run your application
CMD ["venv/bin/python", "embed_script.py"]
