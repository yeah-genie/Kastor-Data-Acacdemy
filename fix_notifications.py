#!/usr/bin/env python3
"""
Convert evidenceNotification and logicThought to regular text messages
"""

import re

# Read the file
with open('/home/user/Kastor-Data-Acacdemy/client/src/data/case1-episode-interactive.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern 1: Convert evidenceNotification to text
# From:
#   {
#     id: "m20",
#     speaker: "system",
#     text: "",
#     evidenceNotification: {
#       title: "EVIDENCE ADDED: Maya's Request Email",
#       icon: "📧"
#     }
#   },
# To:
#   { id: "m20", speaker: "system", text: "📧 EVIDENCE ADDED: Maya's Request Email" },

pattern1 = re.compile(
    r'\{\s*'
    r'id:\s*"([^"]+)",\s*'
    r'speaker:\s*"([^"]+)",\s*'
    r'text:\s*"",\s*'
    r'evidenceNotification:\s*\{\s*'
    r'title:\s*"([^"]+)",\s*'
    r'icon:\s*"([^"]+)"\s*'
    r'\}\s*'
    r'\}',
    re.MULTILINE | re.DOTALL
)

def replace1(match):
    msg_id = match.group(1)
    speaker = match.group(2)
    title = match.group(3)
    icon = match.group(4)
    return f'{{ id: "{msg_id}", speaker: "{speaker}", text: "{icon} {title}" }}'

content = pattern1.sub(replace1, content)

# Pattern 2: Convert logicThought to text
# From:
#   {
#     id: "m51",
#     speaker: "system",
#     text: "",
#     logicThought: {
#       title: "LOGIC THOUGHT UNLOCKED: Shadow's Unnatural Power Spike"
#     }
#   },
# To:
#   { id: "m51", speaker: "system", text: "💡 LOGIC THOUGHT UNLOCKED: Shadow's Unnatural Power Spike" },

pattern2 = re.compile(
    r'\{\s*'
    r'id:\s*"([^"]+)",\s*'
    r'speaker:\s*"([^"]+)",\s*'
    r'text:\s*"",\s*'
    r'logicThought:\s*\{\s*'
    r'title:\s*"([^"]+)"\s*'
    r'\}\s*'
    r'\}',
    re.MULTILINE | re.DOTALL
)

def replace2(match):
    msg_id = match.group(1)
    speaker = match.group(2)
    title = match.group(3)
    return f'{{ id: "{msg_id}", speaker: "{speaker}", text: "💡 {title}" }}'

content = pattern2.sub(replace2, content)

# Write back
with open('/home/user/Kastor-Data-Acacdemy/client/src/data/case1-episode-interactive.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Successfully converted evidenceNotification and logicThought to text messages")
