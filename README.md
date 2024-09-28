# Sanjaya - a Social Media Scraper and Sentiment Analyzer

## Overview

This project is a **social media scraping** tool designed to fetch posts from platforms like **Twitter** and **Telegram**. The data is then analyzed for sentiment using **natural language processing (NLP)** techniques and visualized with key insights like keyword frequency and sentiment distribution.

## Features

- **Platform Scraping**: Fetch data from Twitter, Instagram, and Telegram based on a keyword.
- **Sentiment Analysis**: Analyze the sentiment of posts using the `natural` library.
- **Keyword Extraction**: Extract the most relevant keywords from each post using Term Frequency–Inverse Document Frequency (TF-IDF).
- **Data Visualization**: Visualize the sentiment distribution and keyword occurrence for better insights.
- **Session Persistence**: Automatically saves and reuses session information to avoid repeated logins.
- **Rate Limiting**: Implements rate-limiting mechanisms to avoid scraping limits (Telegram).
