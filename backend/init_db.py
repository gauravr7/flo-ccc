#!/usr/bin/env python3
"""
Database initialization script with 14 days of dummy data
"""

import os
import sys
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.models import Base, UsageRecord, DATABASE_URL
from utils.calculations import calculate_costs_and_metrics

# Sample prompts and responses for dummy data
SAMPLE_PROMPTS = [
    "What is machine learning?",
    "Explain quantum computing in simple terms",
    "How does blockchain technology work?",
    "What are the benefits of renewable energy?",
    "Describe the process of photosynthesis",
    "How do neural networks learn?",
    "What is the difference between AI and ML?",
    "Explain cloud computing architecture",
    "What are the principles of sustainable development?",
    "How does cryptocurrency mining work?",
    "What is the role of DNA in genetics?",
    "Explain the concept of big data analytics",
    "How do solar panels generate electricity?",
    "What is the internet of things (IoT)?",
    "Describe the water cycle process",
    "How does 5G technology work?",
    "What are the effects of climate change?",
    "Explain the basics of cybersecurity",
    "How do electric vehicles work?",
    "What is artificial intelligence ethics?"
]

SAMPLE_RESPONSES = [
    "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed.",
    "Quantum computing uses quantum mechanical phenomena to perform calculations that would be impossible for classical computers.",
    "Blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked using cryptography.",
    "Renewable energy sources like solar, wind, and hydroelectric power provide clean alternatives to fossil fuels and help reduce carbon emissions.",
    "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen.",
    "Neural networks learn through backpropagation, adjusting weights and biases based on the error between predicted and actual outputs.",
    "AI is the broader concept of machines mimicking human intelligence, while ML is a specific approach to achieve AI through data-driven learning.",
    "Cloud computing architecture consists of frontend platforms, backend platforms, cloud-based delivery, and a network infrastructure.",
    "Sustainable development balances economic growth, environmental protection, and social equity for present and future generations.",
    "Cryptocurrency mining involves using computational power to solve complex mathematical problems and validate transactions on a blockchain network.",
    "DNA contains genetic instructions for the development, functioning, and reproduction of all known living organisms.",
    "Big data analytics involves examining large datasets to uncover hidden patterns, correlations, and insights for better decision-making.",
    "Solar panels convert sunlight into electricity through photovoltaic cells that create an electric current when exposed to light.",
    "IoT refers to the network of physical devices embedded with sensors, software, and connectivity to exchange data.",
    "The water cycle is the continuous movement of water through evaporation, condensation, precipitation, and collection.",
    "5G technology uses higher frequency radio waves and advanced antenna technology to provide faster data speeds and lower latency.",
    "Climate change leads to rising temperatures, sea level rise, extreme weather events, and ecosystem disruptions.",
    "Cybersecurity involves protecting digital systems, networks, and data from unauthorized access, attacks, and damage.",
    "Electric vehicles use rechargeable batteries to power electric motors, offering zero direct emissions and high efficiency.",
    "AI ethics addresses the moral implications and responsibilities of developing and deploying artificial intelligence systems."
]

MODELS = ["sonar-reasoning-pro", "sonar-pro", "sonar"]

def create_dummy_data():
    """Create 14 days of dummy usage data"""

    # Create database engine and session
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    db = SessionLocal()

    try:
        # Check if data already exists
        existing_count = db.query(UsageRecord).count()
        if existing_count > 0:
            print(f"Database already contains {existing_count} records.")
            response = input("Do you want to clear existing data and recreate? (y/N): ")
            if response.lower() != 'y':
                print("Skipping database initialization.")
                return
            else:
                # Clear existing data
                db.query(UsageRecord).delete()
                db.commit()
                print("Cleared existing data.")

        print("Creating 14 days of dummy data...")

        # Generate data for the last 14 days
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=14)

        total_records = 0

        for day in range(14):
            current_date = start_date + timedelta(days=day)

            # Random number of API calls per day (5-20)
            daily_calls = random.randint(5, 20)

            for call in range(daily_calls):
                # Random time throughout the day
                random_hour = random.randint(0, 23)
                random_minute = random.randint(0, 59)
                random_second = random.randint(0, 59)

                record_time = current_date.replace(
                    hour=random_hour, 
                    minute=random_minute, 
                    second=random_second
                )

                # Select random prompt and response
                prompt = random.choice(SAMPLE_PROMPTS)
                response = random.choice(SAMPLE_RESPONSES)
                model = random.choice(MODELS)

                # Calculate metrics
                metrics = calculate_costs_and_metrics(prompt, response, model)

                # Create database record
                usage_record = UsageRecord(
                    model=model,
                    prompt_tokens=metrics["prompt_tokens"],
                    completion_tokens=metrics["completion_tokens"],
                    total_tokens=metrics["total_tokens"],
                    search_context_size=metrics["search_context_size"],
                    input_tokens_cost=metrics["input_tokens_cost"],
                    output_tokens_cost=metrics["output_tokens_cost"],
                    request_cost=metrics["request_cost"],
                    total_cost=metrics["total_cost"],
                    input_prompt=prompt,
                    output_prompt=response,
                    created_at=record_time,
                    energy_consumed=metrics["energy_consumed"],
                    carbon_emission=metrics["carbon_emission"]
                )

                db.add(usage_record)
                total_records += 1

        # Commit all records
        db.commit()
        print(f"Successfully created {total_records} dummy records across 14 days!")

        # Print summary statistics
        total_tokens = db.query(func.sum(UsageRecord.total_tokens)).scalar()
        total_cost = db.query(func.sum(UsageRecord.total_cost)).scalar()
        total_carbon = db.query(func.sum(UsageRecord.carbon_emission)).scalar()
        total_energy = db.query(func.sum(UsageRecord.energy_consumed)).scalar()

        print("\n--- Summary Statistics ---")
        print(f"Total Records: {total_records}")
        print(f"Total Tokens: {total_tokens:,}")
        print(f"Total Cost: ${total_cost:.6f}")
        print(f"Total Carbon Emission: {total_carbon:.4f} gCO2")
        print(f"Total Energy Consumed: {total_energy:.8f} kWh")

    except Exception as e:
        print(f"Error creating dummy data: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    from sqlalchemy import func
    create_dummy_data()
