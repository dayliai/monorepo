#!/bin/bash

# ============================================================
# Dayli AI — First-Time Setup Script
# Run this on any new machine to get the project ready.
# Usage: bash scripts/setup.sh
# ============================================================

set -e

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

passed=0
failed=0
total=5

echo ""
echo -e "${PURPLE}${BOLD}🦋 Dayli AI — Project Setup${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ---- Helper functions ----
check_pass() {
  echo -e "  ${GREEN}✓${NC} $1"
  ((passed++))
}

check_fail() {
  echo -e "  ${RED}✗${NC} $1"
  ((failed++))
}

step_header() {
  echo ""
  echo -e "${CYAN}${BOLD}Step $1:${NC} $2"
}

# ============================================================
# STEP 1: Check Node.js version
# ============================================================
step_header "1/5" "Node.js (v20 required)"

# Load nvm if available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" 2>/dev/null

if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_VERSION" -eq 20 ] 2>/dev/null; then
    check_pass "Node.js v$(node -v | sed 's/v//') installed"
  else
    check_fail "Node.js v$(node -v | sed 's/v//') found — need v20"
    echo ""
    echo -e "  ${YELLOW}Fix:${NC} Run these commands:"
    if command -v nvm &> /dev/null; then
      echo -e "    ${BOLD}nvm install 20 && nvm use 20${NC}"
    else
      echo -e "    First install nvm: ${BOLD}curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash${NC}"
      echo -e "    Then restart terminal and run: ${BOLD}nvm install 20 && nvm use 20${NC}"
    fi
  fi
else
  check_fail "Node.js not found"
  echo ""
  echo -e "  ${YELLOW}Fix:${NC} Install nvm first:"
  echo -e "    ${BOLD}curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash${NC}"
  echo -e "    Restart terminal, then: ${BOLD}nvm install 20 && nvm use 20${NC}"
fi

# ============================================================
# STEP 2: Check pnpm
# ============================================================
step_header "2/5" "pnpm (package manager)"

if command -v pnpm &> /dev/null; then
  check_pass "pnpm v$(pnpm -v) installed"
else
  check_fail "pnpm not found"
  echo ""
  echo -e "  ${YELLOW}Fix:${NC} Run:"
  echo -e "    ${BOLD}npm install -g pnpm${NC}"
fi

# ============================================================
# STEP 3: Check node_modules
# ============================================================
step_header "3/5" "Dependencies (node_modules)"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

if [ -d "$PROJECT_DIR/node_modules/.pnpm" ] || [ -d "$PROJECT_DIR/apps/landing/node_modules/vite" ] || [ -d "$PROJECT_DIR/apps/web/node_modules/next" ]; then
  check_pass "Dependencies installed"
else
  check_fail "Dependencies not installed"
  echo ""
  echo -e "  ${YELLOW}Fix:${NC} Run from project root:"
  echo -e "    ${BOLD}pnpm install --node-linker=hoisted${NC}"

  # Auto-install if pnpm is available
  if command -v pnpm &> /dev/null; then
    echo ""
    read -p "  Install now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo -e "  ${CYAN}Installing dependencies...${NC}"
      cd "$PROJECT_DIR" && pnpm install --node-linker=hoisted
      if [ $? -eq 0 ]; then
        echo -e "  ${GREEN}✓ Dependencies installed${NC}"
        ((passed++))
        ((failed--))
      fi
    fi
  fi
fi

# ============================================================
# STEP 4: Check .env files
# ============================================================
step_header "4/5" "Environment variables (.env files)"

LANDING_ENV="$PROJECT_DIR/apps/landing/.env"
WEB_ENV="$PROJECT_DIR/apps/web/.env"
env_ok=true

if [ -f "$LANDING_ENV" ]; then
  if grep -q "VITE_SUPABASE_URL" "$LANDING_ENV" && grep -q "VITE_SUPABASE_ANON_KEY" "$LANDING_ENV"; then
    echo -e "  ${GREEN}✓${NC} apps/landing/.env configured"
  else
    echo -e "  ${RED}✗${NC} apps/landing/.env exists but missing required variables"
    env_ok=false
  fi
else
  echo -e "  ${RED}✗${NC} apps/landing/.env not found"
  env_ok=false
fi

if [ -f "$WEB_ENV" ]; then
  if grep -q "NEXT_PUBLIC_SUPABASE_URL" "$WEB_ENV" && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$WEB_ENV"; then
    echo -e "  ${GREEN}✓${NC} apps/web/.env configured"
  else
    echo -e "  ${RED}✗${NC} apps/web/.env exists but missing required variables"
    env_ok=false
  fi
else
  echo -e "  ${RED}✗${NC} apps/web/.env not found"
  env_ok=false
fi

if [ "$env_ok" = true ]; then
  check_pass "Both .env files configured"
else
  ((failed++))
  echo ""
  echo -e "  ${YELLOW}Fix:${NC} Create the .env files with your Supabase credentials."
  echo -e "  Ask the team lead for the values, then create:"
  echo ""
  echo -e "  ${BOLD}apps/landing/.env${NC}"
  echo -e "  ${BOLD}apps/web/.env${NC}"
  echo ""
  echo -e "  apps/landing/.env needs:"
  echo -e "    VITE_SUPABASE_URL=https://your-project.supabase.co"
  echo -e "    VITE_SUPABASE_ANON_KEY=your-anon-key"
  echo ""
  echo -e "  apps/web/.env needs:"
  echo -e "    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
  echo -e "    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"

  # Offer to create them interactively
  echo ""
  read -p "  Enter them now? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    read -p "  Supabase URL: " SUPA_URL
    read -p "  Supabase Anon Key: " SUPA_KEY
    echo ""

    if [ -n "$SUPA_URL" ] && [ -n "$SUPA_KEY" ]; then
      echo "VITE_SUPABASE_URL=$SUPA_URL" > "$LANDING_ENV"
      echo "VITE_SUPABASE_ANON_KEY=$SUPA_KEY" >> "$LANDING_ENV"
      echo "NEXT_PUBLIC_SUPABASE_URL=$SUPA_URL" > "$WEB_ENV"
      echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPA_KEY" >> "$WEB_ENV"
      echo -e "  ${GREEN}✓ Both .env files created${NC}"
      ((passed++))
      ((failed--))
    fi
  fi
fi

# ============================================================
# STEP 5: Check git remote
# ============================================================
step_header "5/5" "Git connection"

cd "$PROJECT_DIR"
if git remote -v 2>/dev/null | grep -q "github.com"; then
  REMOTE_URL=$(git remote get-url origin 2>/dev/null)
  check_pass "Git remote: $REMOTE_URL"

  # Check git identity
  GIT_EMAIL=$(git config user.email 2>/dev/null)
  if [ -n "$GIT_EMAIL" ]; then
    echo -e "  ${GREEN}✓${NC} Git identity: $GIT_EMAIL"
  else
    echo -e "  ${YELLOW}!${NC} Git identity not set"
    echo -e "    Run: ${BOLD}git config user.name \"Your Name\"${NC}"
    echo -e "    Run: ${BOLD}git config user.email \"your-github-email@example.com\"${NC}"
  fi
else
  check_fail "Git remote not configured"
  echo ""
  echo -e "  ${YELLOW}Fix:${NC} Run:"
  echo -e "    ${BOLD}git remote add origin https://github.com/dayliai/monorepo.git${NC}"
fi

# ============================================================
# SUMMARY
# ============================================================
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $failed -eq 0 ]; then
  echo ""
  echo -e "  ${GREEN}${BOLD}✓ All checks passed!${NC}"
  echo ""
  echo -e "  You're ready to go. Start working:"
  echo -e "    ${BOLD}pnpm dev:landing${NC}  → Landing page on localhost:3000"
  echo -e "    ${BOLD}pnpm dev:web${NC}      → Web app on localhost:3001"
  echo ""
  echo -e "  Or push changes live:"
  echo -e "    ${BOLD}git add --all && git commit -m \"message\" && git push${NC}"
  echo ""
else
  echo ""
  echo -e "  ${YELLOW}${BOLD}$passed/$total checks passed, $failed need attention${NC}"
  echo ""
  echo -e "  Fix the items above, then run this script again:"
  echo -e "    ${BOLD}bash scripts/setup.sh${NC}"
  echo ""
fi

echo -e "${PURPLE}🦋 Dayli AI${NC}"
echo ""
