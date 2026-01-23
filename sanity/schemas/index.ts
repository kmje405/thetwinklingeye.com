// Schema Index
// This file exports all schema definitions for reference
// These should be implemented in your Sanity Studio

// Schema exports removed due to TypeScript issues
// Refer to individual schema files for documentation

// Schema types array for Sanity Studio configuration
export const schemaTypes = [
  "siteSettings",
  "blogPost",
  "interview",
  "person",
  "category",
];

// README for Sanity Setup
export const SANITY_SETUP_INSTRUCTIONS = `
# Sanity Setup Instructions

## 1. Create a Sanity Project
- Go to https://sanity.io and create a new project
- Note your Project ID and Dataset name

## 2. Set up Environment Variables
Add these to your .env file:
- PUBLIC_SANITY_PROJECT_ID=your_project_id
- PUBLIC_SANITY_DATASET=production

## 3. Create Schemas in Sanity Studio
Use the schema definitions in this folder to create the following document types in your Sanity Studio:
- siteSettings (singleton)
- blogPost
- interview  
- person
- category

## 4. Initial Data Setup
Create at least one document of each type:
- One siteSettings document with your site configuration
- One person document for the default author
- Sample categories for blog posts

## 5. Content Structure
- Blog posts reference a person (author) and can have multiple categories
- Interviews reference a person (guest) and include YouTube URLs
- Site settings is a singleton document for global site configuration
`;
