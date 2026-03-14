---
title: 'AlohaMarket'
description: 'Event-driven marketplace backend with microservices, Kafka workflows, gateway routing, and production-minded observability.'
publishDate: '2025-04-10T08:00:00Z'
updatedDate: '2026-03-14T08:00:00Z'
tags:
  - microservices
  - marketplace
  - distributed-systems
category: 'flagship'
order: 2
role: 'Backend engineer'
duration: '2025'
stack:
  - ASP.NET Core
  - Kafka
  - YARP
  - Keycloak
  - SignalR
links:
  - type: 'github'
    href: 'https://github.com/AlohaMarket/AlohaMarket.Aspire'
    label: 'Source Code'
draft: false
---

## Overview

AlohaMarket is an event-driven marketplace backend built around multiple service boundaries rather than a single monolith. It covers the kind of architecture work I enjoy most: coordination, messaging, gateway design, authentication, and operational visibility.

## Architecture

- Structured the system around 8 microservices with explicit responsibilities.
- Used Kafka-based workflows for asynchronous coordination.
- Routed external traffic through YARP gateway patterns.
- Added identity and access management through Keycloak.

## What It Demonstrates

This project shows that I am comfortable working where architecture choices directly affect system behavior. Instead of focusing on a single endpoint or isolated CRUD flow, the work lived at the boundary between services, events, and runtime reliability.

## Takeaway

AlohaMarket represents my strongest backend instinct: make complex systems understandable, observable, and stable enough to evolve.
