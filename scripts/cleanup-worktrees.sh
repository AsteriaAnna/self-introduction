#!/bin/bash
# cleanup-worktrees.sh - 清理已合并的worktree
# Usage: ./cleanup-worktrees.sh

set -e

echo "==============================================="
echo "  Cleaning Up Merged Worktrees"
echo "==============================================="
echo ""

MAIN_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")

echo "Main branch: $MAIN_BRANCH"
echo ""

git worktree list

echo ""
echo "Checking for merged worktrees..."

git worktree list | grep -v "(bare)" | grep -v "$MAIN_BRANCH" | while read worktree_path commit branch; do
    branch_name=$(echo "$branch" | tr -d '[]' | tr -d ' ')
    
    if [ -z "$branch_name" ]; then
        continue
    fi

    echo ""
    echo "Checking branch: $branch_name"
    
    if git branch --merged "$MAIN_BRANCH" 2>/dev/null | grep -q "^\s*$branch_name$"; then
        echo "  -> Branch is merged. Removing worktree..."
        git worktree remove "$worktree_path" 2>/dev/null || {
            echo "  -> Worktree removal failed, trying force..."
            git worktree remove "$worktree_path" --force 2>/dev/null || true
        }
        echo "  -> Deleting local branch: $branch_name"
        git branch -d "$branch_name" 2>/dev/null || {
            echo "  -> Force deleting branch..."
            git branch -D "$branch_name" 2>/dev/null || true
        }
        echo "  -> Done!"
    else
        echo "  -> Branch not merged, keeping."
    fi
done

echo ""
echo "==============================================="
echo "  Cleanup Complete!"
echo "==============================================="
echo ""
echo "Remaining worktrees:"
git worktree list
echo ""
