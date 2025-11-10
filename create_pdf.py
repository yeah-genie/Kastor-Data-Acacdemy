#!/usr/bin/env python3
"""
Create Episode 1 PDF using Python libraries
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
import re

def create_pdf():
    """Create PDF from markdown content"""

    pdf_file = "EPISODE1_INTERACTIVE_FULL.pdf"

    # Create PDF
    doc = SimpleDocTemplate(
        pdf_file,
        pagesize=A4,
        rightMargin=50,
        leftMargin=50,
        topMargin=50,
        bottomMargin=50
    )

    # Container for the 'Flowable' objects
    elements = []

    # Define styles
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a1a1a'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )

    heading1_style = ParagraphStyle(
        'CustomHeading1',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#2c3e50'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )

    heading2_style = ParagraphStyle(
        'CustomHeading2',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#34495e'),
        spaceAfter=10,
        spaceBefore=10,
        fontName='Helvetica-Bold'
    )

    heading3_style = ParagraphStyle(
        'CustomHeading3',
        parent=styles['Heading3'],
        fontSize=12,
        textColor=colors.HexColor('#7f8c8d'),
        spaceAfter=8,
        spaceBefore=8,
        fontName='Helvetica-Bold'
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=10,
        textColor=colors.HexColor('#2c3e50'),
        spaceAfter=6,
        alignment=TA_LEFT,
        fontName='Helvetica'
    )

    quote_style = ParagraphStyle(
        'Quote',
        parent=styles['BodyText'],
        fontSize=10,
        textColor=colors.HexColor('#7f8c8d'),
        leftIndent=20,
        rightIndent=20,
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Oblique'
    )

    code_style = ParagraphStyle(
        'Code',
        parent=styles['Code'],
        fontSize=9,
        textColor=colors.HexColor('#c7254e'),
        backColor=colors.HexColor('#f9f2f4'),
        leftIndent=10,
        fontName='Courier'
    )

    # Read markdown file
    with open('EPISODE1_INTERACTIVE_FULL.md', 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse and add content
    lines = content.split('\n')

    for i, line in enumerate(lines):
        line = line.strip()

        if not line:
            elements.append(Spacer(1, 6))
            continue

        # Title (# )
        if line.startswith('# '):
            text = line[2:]
            elements.append(Paragraph(text, title_style))
            elements.append(Spacer(1, 12))

        # Heading 1 (## )
        elif line.startswith('## '):
            text = line[3:]
            elements.append(Spacer(1, 12))
            elements.append(Paragraph(text, heading1_style))

        # Heading 2 (### )
        elif line.startswith('### '):
            text = line[4:]
            elements.append(Paragraph(text, heading2_style))

        # Heading 3 (#### )
        elif line.startswith('#### '):
            text = line[5:]
            elements.append(Paragraph(text, heading3_style))

        # Horizontal rule
        elif line.startswith('---'):
            elements.append(Spacer(1, 12))
            elements.append(PageBreak())

        # Code block start
        elif line.startswith('```'):
            # Skip code blocks for now (complex to render)
            continue

        # Quote
        elif line.startswith('>'):
            text = line[1:].strip()
            elements.append(Paragraph(text, quote_style))

        # Bold text pattern **text**
        elif '**' in line:
            text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', line)
            elements.append(Paragraph(text, body_style))

        # Normal text
        else:
            # Clean up markdown formatting
            text = line.replace('*', '')
            if text:
                elements.append(Paragraph(text, body_style))

    # Build PDF
    try:
        doc.build(elements)
        print(f"✓ PDF created successfully: {pdf_file}")
        return True
    except Exception as e:
        print(f"✗ Error creating PDF: {e}")
        return False

if __name__ == "__main__":
    create_pdf()
