# Low-Fidelity Wireframes: Math Training

This document provides a simple wireframe set for the prototype app based on the Product Requirements Document. These are intentionally low-fidelity, text-based layouts to show structure, content flow, and navigation.

---

## 1. Navigation Bar

### Expanded Navigation (desktop / tablet)

```text
+--------------------------------------------------------------------------------------+
| Math Training                            Home   Quick Training   Test   Intensive   |
+--------------------------------------------------------------------------------------+
```

### Collapsed Navigation (mobile)

```text
+------------------------------+
| Math Training        ☰       |
+------------------------------+
| Home                         |
| Quick Training               |
| Test                         |
| Intensive                    |
+------------------------------+
```

### Notes
- The navigation is minimal and child-friendly.
- The mobile version collapses into a hamburger menu.
- The app has no login or account section.

---

## 2. Home Screen

```text
+--------------------------------------------------------------------------------------+
| Math Training                                         [Menu ☰]           |
+--------------------------------------------------------------------------------------+
|                                                                                      |
| Welcome to Math Training!                                                            |
| Practice your addition and subtraction in short, fun exercises.                     |
|                                                                                      |
| +----------------------+   +----------------------+   +----------------------+     |
| | Quick Training       |   | Test                 |   | Intensive Test       |     |
| | 10 tasks             |   | 20 tasks             |   | 40 tasks             |     |
| | No name required     |   | Name required        |   | Name required        |     |
| +----------------------+   +----------------------+   +----------------------+     |
|                                                                                      |
| +---------------------------------------------------------------+                   |
| | Leaderboard                                                   |                   |
| | Test                                                         |                   |
| | 1. Alex 18/20 90% 00:40                                     |                   |
| | 2. Mia 17/20 85% 00:45                                       |                   |
| | 3. Leo 16/20 80% 00:50                                       |                   |
| | ...                                                         |                   |
| | [Switch: Test / Intensive]                                   |                   |
| | [Reset Leaderboard]                                           |                   |
| +---------------------------------------------------------------+                   |
|                                                                                      |
+--------------------------------------------------------------------------------------+
```

### Home Screen Notes
- The mode cards are large and easy to tap.
- Leaderboard is visible without extra navigation.
- Reset button is clearly labeled.

---

## 3. Preparation Screen

### Test / Intensive Test preparation

```text
+--------------------------------------------------------------------------------------+
| Math Training                                          [Back]           |
+--------------------------------------------------------------------------------------+
|                                                                                      |
| Mode: Test                                                                           |
| Questions: 20                                                                       |
|                                                                                      |
| Player Name                                                                        |
| +-------------------------------------------+                                    |
| | Enter your name                          |                                    |
| +-------------------------------------------+                                    |
|                                                                                      |
| [Start]                                                                             |
|                                                                                      |
+--------------------------------------------------------------------------------------+
```

### Quick Training preparation

```text
+--------------------------------------------------------------------------------------+
| Math Training                                          [Back]           |
+--------------------------------------------------------------------------------------+
|                                                                                      |
| Mode: Quick Training                                                                |
| Questions: 10                                                                       |
|                                                                                      |
| No player name required                                                            |
|                                                                                      |
| [Start]                                                                             |
|                                                                                      |
+--------------------------------------------------------------------------------------+
```

### Preparation Screen Notes
- Only Test and Intensive Test require a player name.
- The Start button is disabled until the required field is valid.

---

## 4. Training Screen

```text
+--------------------------------------------------------------------------------------+
| Math Training                                  [Cancel]     00:42           |
+--------------------------------------------------------------------------------------+
|                                                                                      |
| Question 3 of 20                                                                    |
| [##########------] 15%                                                              |
|                                                                                      |
| 18 + 5 = ?                                                                          |
|                                                                                      |
| +-------------------------------+                                                  |
| |                               |                                                  |
| +-------------------------------+                                                  |
|                                                                                      |
| [Submit]                                                                             |
|                                                                                      |
+--------------------------------------------------------------------------------------+
```

### Training Screen Notes
- Large question at center for readability.
- Timer visible only in timed modes.
- Progress bar shows current status.
- Numeric keypad is implied via text input on mobile.

---

## 5. Result Screen

```text
+--------------------------------------------------------------------------------------+
| Math Training                                                        [Home] |
+--------------------------------------------------------------------------------------+
|                                                                                      |
| Result Summary                                                                      |
|                                                                                      |
| Player: Alex                                                                        |
| Mode: Test                                                                          |
| Total Questions: 20                                                                 |
| Correct: 18                                                                         |
| Wrong: 2                                                                            |
| Accuracy: 90%                                                                       |
| Time: 00:42                                                                         |
| Rank: #2                                                                            |
|                                                                                      |
| Great job!                                                                          |
|                                                                                      |
| Incorrect Answers:                                                                  |
| 7 - 4 = 1 (wrong)                                                                  |
| 9 + 6 = 14 (wrong)                                                                 |
|                                                                                      |
| [Restart]   [Home]                                                                  |
|                                                                                      |
+--------------------------------------------------------------------------------------+
```

### Result Screen Notes
- This screen is highly visual and positive in tone.
- Ranking information is displayed clearly.
- Incorrect answers are shown in a compact summary.

---

## 6. Leaderboard View

```text
+---------------------------------------------------------------+
| Leaderboard                                                   |
| Mode: Test                                                    |
|---------------------------------------------------------------|
| #1 Alex   18/20  90%   00:42   2026-10-09                    |
| #2 Mia    17/20  85%   00:45   2026-10-09                    |
| #3 Leo    16/20  80%   00:50   2026-10-09                    |
| #4 Nina   15/20  75%   00:55   2026-10-09                    |
| #5 Max    14/20  70%   01:00   2026-10-09                    |
| ...                                                           |
+---------------------------------------------------------------+
```

### Notes
- Separate leaderboard for Test and Intensive Test.
- Only top 10 entries are displayed.
- Sorting is score first, then time.

---

## 7. Wireframe Summary

The prototype follows a simple app flow:

```text
Home Screen
   -> Select Mode
      -> Preparation Screen
          -> Training Screen
              -> Result Screen
                  -> Home Screen / Restart
```

This structure fits the PRD and keeps navigation simple for third-grade students.

---

## 8. Suggested Interaction Pattern

- Home screen acts as the main entry point.
- Mode selection cards are the primary CTA.
- Start button begins a full test session.
- Back button returns to the home screen.
- Cancel button ends a running session.
- Result screen gives summary and reinforces success.

---

## 9. Design Direction Notes

- Large buttons with strong contrast
- Simple card layout with plenty of spacing
- Bold typography for questions and key numbers
- High contrast dark theme using the PRD palette
- Clear focus states for keyboard users

