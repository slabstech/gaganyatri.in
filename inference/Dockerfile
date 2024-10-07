# Use a base image with Python
FROM python:3.10-bullseye

# Set the working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .

#RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -r requirements.txt

# Copy the rest of your application code
COPY . .

# Command to run your application
CMD ["python", "embed_script.py"] 
