# Backend Academy Landing Page Refactor Plan
> Role: Senior Frontend Engineer
> Goal: Create a premium, animation-driven landing page WITHOUT affecting the global component library.
>
> **Important Constraint**
> Existing shared components are used throughout the application.
> They should NOT be modified unless the improvement is completely generic and benefits the entire app.
> Landing-specific functionality must live inside its own folder.

---

# Existing Components

## KEEP AS-IS ✅

These are generic design-system components and should remain untouched.

- Button
- Badge
- Alert
- Card
- Input
- Loader
- Modal
- Pagination
- SearchBar
- Spinner
- Toast

Reason:
These belong to the application's design system, not the landing page.

---

## KEEP AS-IS (Course Components)

- CourseGrid
- LessonCard
- LessonList
- ProgressBar
- MarkdownViewer
- VideoPlayer

Reason:
They already solve reusable problems and should remain independent from landing animations.

---

## KEEP AS-IS (Layout)

- Navbar
- Footer
- ProtectedRoute

---

## KEEP AS-IS (AI)

- ChatMessage
- ChatWindow
- PromptBox
- TypingIndicator

These are application features.
Landing page should compose them, not modify them.

---

# Components That May Receive SMALL Generic Improvements

These improvements should remain generic enough to benefit the whole application.

---

## CodeSnippet

Can safely receive:

- terminal mode
- optional typing animation
- optional highlighted lines
- optional fake execution state
- optional filename
- optional language badge

These improvements are reusable everywhere.

---

## CourseCard

Keep the API exactly the same.

Only allow optional props such as

- animationEnabled
- featured
- compact

No landing-specific logic.

Landing animations happen OUTSIDE this component.

---

## Card

Optional generic additions only.

Possible props

- glass
- glow
- borderAnimated

These remain reusable.

---

# DO NOT MODIFY

The following should never know they are inside the landing page.

- Button
- Badge
- Footer
- Navbar
- Loader
- ChatWindow
- CourseGrid

Landing page composes them.

It does not specialize them.

---

# New Landing Components

Everything unique belongs here.

src/
components/
landing/

---

## HeroPlayground

Purpose

Main hero section.

Contains

- Headline
- Terminal
- Execute button
- JSON output
- Background blobs
- Framer Motion logic

Uses

- Button
- Badge
- CodeSnippet

---

## TerminalWindow

Purpose

Glassmorphism terminal.

Contains

Left

Spring Boot controller

Right

JSON output

Reusable only inside landing.

---

## ExecuteAnimation

Responsible only for

- execute pulse
- progress line
- typing animation
- request lifecycle

No UI.

Animation controller only.

---

## JsonMorph

Responsible for

layoutId transitions.

Example

JSON

↓

Course Card

JSON

↓

Architecture Node

No UI.

Animation helper.

---

## ValueSection

Replacement for the current feature cards.

Still uses

Card

Badge

Lucide icons

Adds

better layout

motion

stagger animations

---

## TheoryPracticeMatrix

Completely new section.

Replaces

Roadmap

Curriculum

Projects

Timeline

Hover interaction

Left

Theory

Right

Production system

---

## ArchitecturePipeline

Vertical animated SVG timeline.

Contains

Database

↓

Business Logic

↓

Security

↓

Deployment

Owns

useScroll()

motion

SVG

No shared component modifications.

---

## ContextTutorDemo

Landing-only demo.

Composes

CodeSnippet

+

ChatMessage

+

TypingIndicator

Shows

bad code

↓

AI explanation

No changes to AI components.

---

## TerminalCTA

Landing-only CTA.

Contains

Terminal prompt

Execute button

Animated cursor

Routes to register page.

---

## BackgroundEffects

Owns

floating gradients

noise

grid

orbs

No page logic.

---

## SectionHeader

Landing-specific version.

Current headers are repeated.

Extract into one component.

Props

title

subtitle

badge

alignment

---

## ScrollReveal

Reusable wrapper.

Owns

fade

slide

stagger

viewport detection

Instead of duplicating motion logic everywhere.

---

# Landing Folder Structure

src/components/landing/

```
landing/
│
├── HeroPlayground/
├── TerminalWindow/
├── ExecuteAnimation/
├── JsonMorph/
├── ValueSection/
├── TheoryPracticeMatrix/
├── ArchitecturePipeline/
├── ContextTutorDemo/
├── TerminalCTA/
├── BackgroundEffects/
├── SectionHeader/
├── ScrollReveal/
│
├── hooks/
│     useExecuteAnimation.js
│     usePipelineProgress.js
│     useMorphAnimation.js
│
├── constants/
│
├── animations/
│
└── utils/
```

---

# Component Ownership

Global Components

Responsible for

- buttons
- cards
- inputs
- loaders
- badges
- chat
- courses

Landing Components

Responsible for

- storytelling
- motion
- page composition
- scroll interactions
- terminal
- execution demo
- hero
- CTA

This separation keeps the design system clean while allowing the landing page to become highly interactive.

---

# Final Rule

If a feature is useful throughout the application,
improve the existing shared component.

If a feature only exists to tell the landing page story,

create a new landing component.

**The landing page should orchestrate the existing design system—not mutate it.**


# Backend Academy Landing Page
## Phase 2 — Blueprint to Reality Experience

> This document defines ONLY the landing page.
> It is not a component specification.
> It is a storytelling document.
> Every section must naturally flow into the next one.
> The page should feel like one continuous execution pipeline rather than isolated website sections.

---

# Core Philosophy

The landing page should not look like a marketing website.

It should feel like watching a backend request travel through an entire production system.

The visitor should unconsciously experience the same pipeline they will eventually learn.

The story is:

Idea
↓

Request

↓

Backend

↓

Architecture

↓

Production System

↓

Deployment

↓

Engineer

Every section should visually continue from the previous one.

Never feel disconnected.

---

# Emotional Journey

The user should experience:

Curiosity

↓

Power

↓

Understanding

↓

Confidence

↓

Excitement

↓

Action

Not

Hero

↓

Cards

↓

Cards

↓

Cards

↓

Footer

---

# Global Motion Rules

Nothing simply fades in.

Every animation must have a reason.

Information should

transform

grow

connect

execute

compile

assemble

instead of merely appearing.

---

# Page Structure

Hero

↓

Theory becomes Reality

↓

Architecture Pipeline

↓

Production Systems

↓

AI Mentor

↓

Final Execution

---

# SECTION 1

# Hero
## "Architect the Unseen"

This is not a banner.

This is an interactive playground.

Centerpiece:

A beautiful glass terminal.

Left

Spring Boot controller.

Right

Waiting response window.

Large Execute button.

When clicked

Request begins.

Blue execution line races across terminal.

Controller executes.

JSON types itself.

Success.

200 OK.

The user has just triggered their first backend request.

The request is now "alive."

---

# Transition

The JSON should not disappear.

It leaves the terminal.

The data literally floats downward.

The page begins telling the next part of the story.

---

# SECTION 2

# From Data to Reality

The JSON is transformed.

Not faded.

Transformed.

The Course Cards assemble themselves using Framer Motion layoutId.

"title"

flies

↓

becomes

Course Title

"difficulty"

flies

↓

becomes

Difficulty Badge

"instructor"

flies

↓

becomes

Instructor section

The user subconsciously understands

Raw backend data

↓

Beautiful frontend experience

The headline:

"You don't build pages.

You build systems."

---

# SECTION 3

# Theory → Practice Matrix

No curriculum cards.

No roadmap cards.

One interactive experience.

Left

Core backend concepts.

HTTP

Spring Boot

JPA

Security

Docker

Cloud

Right

Every concept instantly swaps to the real production system it enables.

Hover

Security

↓

Authentication Flow

Hover

JPA

↓

Database Diagram

Hover

Docker

↓

Deployment Pipeline

Narrative:

Every concept immediately becomes a real system.

---

# SECTION 4

# Architecture Pipeline

The page becomes vertical.

A single glowing pipeline appears.

Database

↓

Business Logic

↓

Authentication

↓

Caching

↓

Scaling

↓

Deployment

As the user scrolls

Energy flows through the pipeline.

Each node lights up.

Tiny architecture diagrams appear.

Not paragraphs.

Visual architecture.

This section should feel like watching electricity flow through a server rack.

---

# SECTION 5

# Context-Aware AI Mentor

Do NOT show a chatbot.

Show engineering.

Top

Bad code.

Bottom

AI reading that exact code.

AI highlights specific lines.

Instead of answering

It explains WHY.

Example

"I noticed your controller is directly talking to SQL.

Let's understand why the Repository Pattern was invented before fixing it."

This reinforces

Backend Academy teaches principles.

Not syntax.

---

# SECTION 6

# Build Production Systems

Instead of listing projects

Show production systems.

Each one appears as a miniature architecture diagram.

API Gateway

↓

Authentication Service

↓

Database

↓

Redis

↓

Docker

↓

Cloud

Hovering expands each architecture.

Not screenshots.

Not cards.

Tiny animated infrastructure diagrams.

Every project should look like something deployed in production.

---

# SECTION 7

# Proof of Engineering

Replace traditional testimonials.

Instead show engineering achievements.

Animated counters.

Requests Served

API Latency

Deployments

Tests Passing

HTTP Success Rate

Build Status

Everything styled like DevOps dashboards.

---

# SECTION 8

# Final Execution

Everything comes together.

The request lifecycle is complete.

A large terminal drops into place.

HTTP/1.1 200 OK

Content-Type:
application/developer

Heading

Ready to build systems instead of tutorials?

Below

A terminal prompt.

>

Initialize_Student_Session

[ Execute ]

Hover

Cursor blinks.

Glow intensifies.

Click

Navigates to Register.

The request has finished.

The user has become the engineer.

---

# Visual Language

Everything should resemble

developer tools

architecture diagrams

execution pipelines

terminal interfaces

engineering dashboards

NOT

marketing blobs

generic SaaS cards

stock illustrations

---

# Motion Philosophy

Animation hierarchy

Micro

Button hover

Cursor blink

Typing

Icon bounce

Medium

Cards assembling

Pipeline lighting

Timeline movement

Major

JSON morphing

LayoutId transitions

Architecture assembly

Terminal execution

Every large animation should reinforce learning.

Never animate for decoration alone.

---

# Responsive Strategy

Desktop

Full cinematic experience.

Tablet

Reduced movement.

Mobile

No layoutId morphing.

Use stagger animations.

Use stacked layouts.

Simplify architecture pipeline into left-border timeline.

Maintain narrative.

Reduce complexity.

Never reduce quality.

---

# Success Criteria

When someone closes the page they should remember:

"I didn't just see a landing page."

"I watched a backend system come to life."

That emotional memory should differentiate Backend Academy from every other coding platform.