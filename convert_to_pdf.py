#!/usr/bin/env python3
"""
Convert Episode 1 Markdown to PDF
"""

import subprocess
import sys

def convert_md_to_pdf():
    """Convert markdown to PDF using various methods"""

    md_file = "EPISODE1_INTERACTIVE_FULL.md"
    pdf_file = "EPISODE1_INTERACTIVE_FULL.pdf"

    # Try different conversion methods
    methods = [
        # Method 1: Using pandoc (if available)
        ['pandoc', md_file, '-o', pdf_file, '--pdf-engine=xelatex', '-V', 'geometry:margin=1in'],

        # Method 2: Using pandoc with wkhtmltopdf
        ['pandoc', md_file, '-o', pdf_file, '--pdf-engine=wkhtmltopdf'],

        # Method 3: Convert to HTML first
        ['pandoc', md_file, '-o', 'EPISODE1_INTERACTIVE_FULL.html', '-s', '--css=style.css'],
    ]

    for i, method in enumerate(methods):
        try:
            print(f"Trying method {i+1}: {' '.join(method)}")
            subprocess.run(method, check=True, capture_output=True, text=True)
            print(f"✓ Success with method {i+1}!")
            return True
        except subprocess.CalledProcessError as e:
            print(f"✗ Method {i+1} failed: {e}")
            continue
        except FileNotFoundError:
            print(f"✗ Method {i+1} not available (command not found)")
            continue

    print("\n❌ All conversion methods failed.")
    print("\nPlease install one of the following:")
    print("1. pandoc + xelatex: sudo apt-get install pandoc texlive-xetex")
    print("2. pandoc + wkhtmltopdf: sudo apt-get install pandoc wkhtmltopdf")
    print("\nOr use an online converter:")
    print("- https://www.markdowntopdf.com/")
    print("- https://cloudconvert.com/md-to-pdf")
    return False

if __name__ == "__main__":
    convert_md_to_pdf()
