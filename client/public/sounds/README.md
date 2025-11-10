# Sound Effects

This directory contains sound effects for the game.

## Required Sound Files

All sound files should be in `.mp3` format.

### Episode 1 Sounds:
- `notification.mp3` - Email notification sound (ding/chime)
- `click.mp3` - Mouse click / UI interaction sound
- `door-open.mp3` - Door opening sound
- `yawn.mp3` - Yawn / stretching sound

## Recommended Sources:
- **Freesound.org** - Free sound effects library
- **Zapsplat.com** - Free sound effects (requires attribution)
- **Mixkit.co** - Free sound effects

## Usage:
Sound effects are referenced in story data files like:
```typescript
{
  id: "m1",
  speaker: "narrator",
  text: "[Door opens - You enter]",
  soundEffect: "door-open"  // plays /sounds/door-open.mp3
}
```

## Volume:
All sound effects play at 50% volume by default.
