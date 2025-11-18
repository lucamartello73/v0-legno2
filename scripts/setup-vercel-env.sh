#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps you set up all required environment variables for the project

set -e  # Exit on error

echo "============================================"
echo "🚀 Vercel Environment Variables Setup"
echo "============================================"
echo ""

# Check if Vercel token is provided
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ Error: VERCEL_TOKEN environment variable not set"
    echo "Please run: export VERCEL_TOKEN=your_token_here"
    exit 1
fi

echo "✅ Vercel token found"
echo ""

# Check if project is linked
if [ ! -d ".vercel" ]; then
    echo "⚠️  Project not linked to Vercel"
    echo "Linking project..."
    npx vercel link --token "$VERCEL_TOKEN" --yes
    echo ""
fi

echo "📋 This script will set up the following environment variables:"
echo "   1. GMAIL_USER"
echo "   2. GMAIL_APP_PASSWORD"
echo "   3. GMAIL_FROM_NAME"
echo "   4. SUPABASE_URL (if needed)"
echo "   5. SUPABASE_SERVICE_ROLE_KEY (if needed)"
echo "   6. NEXT_PUBLIC_SUPABASE_URL (if needed)"
echo "   7. NEXT_PUBLIC_SUPABASE_ANON_KEY (if needed)"
echo ""

# Function to add environment variable
add_env_var() {
    local var_name=$1
    local var_value=$2
    local is_secret=${3:-true}
    
    echo "Setting $var_name..."
    
    # Create temp file with value
    echo "$var_value" > /tmp/vercel_env_temp
    
    # Add to all environments (production, preview, development)
    if [ "$is_secret" = true ]; then
        cat /tmp/vercel_env_temp | npx vercel env add "$var_name" production --token "$VERCEL_TOKEN" --yes 2>/dev/null || true
        cat /tmp/vercel_env_temp | npx vercel env add "$var_name" preview --token "$VERCEL_TOKEN" --yes 2>/dev/null || true
        cat /tmp/vercel_env_temp | npx vercel env add "$var_name" development --token "$VERCEL_TOKEN" --yes 2>/dev/null || true
    else
        cat /tmp/vercel_env_temp | npx vercel env add "$var_name" production --token "$VERCEL_TOKEN" --yes 2>/dev/null || true
        cat /tmp/vercel_env_temp | npx vercel env add "$var_name" preview --token "$VERCEL_TOKEN" --yes 2>/dev/null || true
        cat /tmp/vercel_env_temp | npx vercel env add "$var_name" development --token "$VERCEL_TOKEN" --yes 2>/dev/null || true
    fi
    
    # Clean up
    rm -f /tmp/vercel_env_temp
    
    echo "✅ $var_name set"
    echo ""
}

# Interactive mode
echo "============================================"
echo "📧 Gmail SMTP Configuration"
echo "============================================"
echo ""

read -p "Enter GMAIL_USER (e.g., your-email@gmail.com): " gmail_user
read -p "Enter GMAIL_APP_PASSWORD (16-char App Password): " gmail_password
read -p "Enter GMAIL_FROM_NAME (e.g., MARTELLO 1930): " gmail_from_name

echo ""
echo "============================================"
echo "🗄️  Supabase Configuration"
echo "============================================"
echo ""

read -p "Do you need to set Supabase variables? (y/n): " setup_supabase

if [ "$setup_supabase" = "y" ] || [ "$setup_supabase" = "Y" ]; then
    read -p "Enter SUPABASE_URL: " supabase_url
    read -p "Enter SUPABASE_SERVICE_ROLE_KEY: " supabase_service_key
    read -p "Enter NEXT_PUBLIC_SUPABASE_ANON_KEY: " supabase_anon_key
fi

echo ""
echo "============================================"
echo "⚙️  Setting Environment Variables..."
echo "============================================"
echo ""

# Set Gmail variables
add_env_var "GMAIL_USER" "$gmail_user" true
add_env_var "GMAIL_APP_PASSWORD" "$gmail_password" true
add_env_var "GMAIL_FROM_NAME" "$gmail_from_name" false

# Set Supabase variables if requested
if [ "$setup_supabase" = "y" ] || [ "$setup_supabase" = "Y" ]; then
    add_env_var "SUPABASE_URL" "$supabase_url" true
    add_env_var "SUPABASE_SERVICE_ROLE_KEY" "$supabase_service_key" true
    add_env_var "NEXT_PUBLIC_SUPABASE_URL" "$supabase_url" false
    add_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$supabase_anon_key" false
fi

echo "============================================"
echo "✅ All Environment Variables Set!"
echo "============================================"
echo ""

# List all environment variables
echo "📋 Current environment variables:"
npx vercel env ls --token "$VERCEL_TOKEN"
echo ""

echo "============================================"
echo "🎉 Setup Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Redeploy your application: npx vercel --prod --token \$VERCEL_TOKEN"
echo "  2. Test email functionality: https://your-domain.vercel.app/api/test-email?email=test@example.com"
echo ""
