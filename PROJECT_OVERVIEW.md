# Project Overview

## Project Name
doodling

## Purpose
I would like to create a simple REACT web app which doodles on its page.

## Target Audience
Some bored people who like to watch a page being filled by circles.

## Key Goals

### Goal 1
Create a Vite/TypeScript/REACT project.

### Goal 2
Create the basic components, like <App>, <Canvas> and <Circle>
I think <Canvas> should save an array of { x: number, y: number }. And render <Circle> for each item.
You probably use SVG for the drawings.
<Circle> should have constant 20px radius.

### Goal 3
Create circles in sequence. At the very beginning, on each corner put one circle.
Next, on every intersection, between border and circle, add circle with center at the intersection.
Generate step by step. Until the <Canvas> is all filled with <Circle>.

### Goal 4
Instead of running all steps at once, you should pause for 3 second after each step.
So that the doodling is drawn step by step.

## Success Criteria
Finally, user should be able to watch your REACT program drawing gradually.