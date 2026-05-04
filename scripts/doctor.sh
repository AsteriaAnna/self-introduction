#!/bin/bash
# scripts/doctor.sh - Environment Health Check Script

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

print_ok() {
    echo -e "[${GREEN}OK${NC}]       $1: $2"
}

print_critical() {
    echo -e "[${RED}CRITICAL${NC}] $1: $2"
    echo -e "   - Suggestion: $3"
}

print_warn() {
    echo -e "[${YELLOW}WARN${NC}]      $1: $2"
    echo -e "   - Suggestion: $3"
}

check_node_version() {
    if [ -f "package.json" ] && command -v node >/dev/null 2>&1; then
        expected_version=$(grep '"node"' package.json | sed -n 's/.*"node": "\([^"]*\)".*/\1/p')
        current_version=$(node -v)

        if [ "$current_version" = "v$expected_version" ]; then
            print_ok "Node.js Version" "$current_version (locked by Volta)"
        else
            print_warn "Node.js Version" "$current_version (expected: v$expected_version)" "Run 'volta pin node@$expected_version' to update"
        fi
    else
        print_warn "Node.js" "Not checked" "Ensure package.json exists"
    fi
}

check_npm_version() {
    if [ -f "package.json" ] && command -v npm >/dev/null 2>&1; then
        expected_npm=$(grep '"npm"' package.json | sed -n 's/.*"npm": "\([^"]*\)".*/\1/p')
        current_npm=$(npm -v)

        if [ "$current_npm" = "$expected_npm" ]; then
            print_ok "npm Version" "$current_npm (locked by Volta)"
        else
            print_warn "npm Version" "$current_npm (expected: $expected_npm)" "Run 'volta pin npm@$expected_npm' to update"
        fi
    fi
}

check_dependencies() {
    if [ -f "package-lock.json" ] && [ -f "package.json" ]; then
        if npm install --package-lock-only --ignore-scripts >/dev/null 2>&1; then
            print_ok "Dependencies" "Synchronized"
        else
            print_critical "Dependencies" "package-lock.json out of sync!" "Run 'npm install' to update dependencies"
        fi
    elif [ -f "package.json" ]; then
        print_warn "Dependencies" "package-lock.json not found" "Run 'npm install' to generate lock file"
    else
        print_critical "Dependencies" "package.json not found" "Project initialization required"
    fi
}

check_typescript() {
    if [ -f "tsconfig.json" ] && command -v tsc >/dev/null 2>&1; then
        if tsc --noEmit >/dev/null 2>&1; then
            print_ok "TypeScript" "No errors"
        else
            print_warn "TypeScript" "Type errors detected" "Run 'npm run typecheck' for details"
        fi
    elif [ -f "tsconfig.json" ]; then
        print_warn "TypeScript" "tsc not installed" "Run 'npm install' to install dependencies"
    fi
}

check_vite_config() {
    if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
        print_ok "Vite Config" "Found"
    else
        print_warn "Vite Config" "Not found" "Create vite.config.ts for proper build configuration"
    fi
}

check_tailwind_config() {
    if [ -f "tailwind.config.js" ] || [ -f "tailwind.config.ts" ]; then
        print_ok "Tailwind CSS" "Configured"
    else
        print_warn "Tailwind CSS" "Not configured" "Create tailwind.config.js for styling"
    fi
}

echo "=========================================="
echo "       Environment Health Check"
echo "=========================================="
echo ""

check_node_version
check_npm_version
check_dependencies
check_typescript
check_vite_config
check_tailwind_config

echo ""
echo "=========================================="
