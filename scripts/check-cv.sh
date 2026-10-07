#!/usr/bin/env bash
# Content checks for a CV html file. Exit 0 = all pass; prints each failing check name.
f="$1"
[ -f "$f" ] || { echo "missing file: $f"; exit 1; }
text=$(sed 's/<[^>]*>//g' "$f")
fail=0
bad() { echo "$1"; fail=1; }
absent() { printf '%s\n' "$text" | grep -iEq "$2" && bad "$1"; }
present() { printf '%s\n' "$text" | grep -Fq -- "$1" || bad "$2: missing '$1'"; }

absent no-sept-2026 'September 2026'
absent no-restructuring 'restructur'
absent no-buzzwords 'passionate|dynamic|results-driven|innovative|rockstar|ninja|synergy|full-stack|backend'
absent no-tech-verbs '(built|designed|developed|implemented|set up|configured) [^.]{0,40}(REST API|CI/CD|Docker|pipeline)'
absent no-oncall 'on-call|24/7|incident'
absent no-pm-terms 'roadmap|KPI|OKR'
for k in Python JavaScript Frappe ERPNext 'REST APIs' MariaDB Git Linux Docker CI/CD production; do present "$k" has-keywords; done
for t in 'Junior Web Developer' 'Mid-Senior Web Developer' 'Senior Web Developer' 'Product Owner'; do present "$t" has-progression; done
grep -iEq '<table|<img' "$f" && bad no-tables
url=$(sed -nE 's/^ *url: "([^"]+)".*/\1/p' "$(dirname "$0")/../src/lib/content.ts")
grep -Fq "href=\"$url/\"" "$f" || bad "portfolio-url: missing site.url ($url)"
exit $fail
