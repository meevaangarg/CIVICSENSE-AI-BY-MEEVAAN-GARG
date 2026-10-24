<div align="center">

<img src="public/assets/logo_civica.svg" alt="CIVICA logo" width="96" />

# CIVICA

### Evidence-based civic intelligence and automated municipal dispatch for Delhi

Transform raw, unstructured citizen reports into structured civic intelligence, spatial deduplication clusters, and verified municipal work orders using Google Gemini and computer vision.

<br />

[![Live demo](https://img.shields.io/badge/Live%20demo-civica--delhi.vercel.app-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://civicsense-ai-by-meevaan-garg.vercel.app)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

![React](https://img.shields.io/badge/React%2019-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%20v4-0EA5E9?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Delhi Municipalities](https://img.shields.io/badge/Routing-MCD%20%7C%20PWD%20%7C%20DJB%20%7C%20DPCC-15803D?style=flat-square)

</div>

<br />

## Overview

In metropolitan Delhi, civic redressal systems suffer from jurisdictional confusion, language barriers, and duplicate complaint flooding. Citizens often cannot distinguish whether an overflowing stormwater drain or damaged road falls under the **MCD** (Municipal Corporation of Delhi), **PWD** (Public Works Department), or **DJB** (Delhi Jal Board). Consequently, municipal control rooms receive thousands of vague, unprioritized complaints with zero actionable specifications.

**CIVICA** acts as an intelligent municipal triage layer. It ingests multimodal citizen input (photographs, conversational Hindi, Hinglish, or English text), isolates the precise civic failure, deduplicates geographically adjacent complaints into unified high-priority clusters, generates structured engineering work-orders, and verifies contractor resolutions through automated visual inspection.

<br />

## Architecture

```
[ Citizen Input ]                  [ CIVICA AI Engine ]                 [ Municipal Action ]
  Photo + Voice (Hindi/Hinglish)  -->  Multimodal Vision + Geocoding  -->  Department Work Order
  GPS Ward Mapping (Delhi)        -->  Spatial Cluster Engine         -->  Live Heatmap & SLA
  Resolution Verification Photo   -->  Visual Before/After Validator  -->  Anti-Corruption Audit
```

<br />

| Stage | Component | Role |
|---|---|---|
| **Intake** | Multimodal Triage | Ingests high-resolution scene photography and multilingual audio/text; extracts damage classification, severity rating (1 to 5), and safety hazard index. |
| **Jurisdiction** | Ward Router | Maps GPS coordinates to Delhi administrative zones and resolves jurisdictional boundaries between MCD, PWD, DJB, DPCC, and NDMC. |
| **Synthesis** | Cluster Consolidator | Groups recurring complaints within a dynamic spatial radius into a single master incident, preventing queue exhaustion and measuring true community impact. |
| **Dispatch** | Gemini Work-Order Engine | Translates colloquial descriptions into formal engineering memos, detailing required machinery (e.g. JCB backhoe, suction tanker), labor units, and response SLAs. |
| **Audit** | Visual Fix Validator | Evaluates contractor completion photos against original baseline images using visual embeddings to detect fraudulent ticket closures. |

<br />

## Municipal Coverage Matrix

| Authority | Jurisdiction & Responsibilities | Automated SLA |
|---|---|---|
| **MCD** | Solid waste management, colony roads under 60ft, local drainage, vector control | 24 - 48 Hours |
| **PWD** | Arterial roads, flyovers, major stormwater channels, central verge maintenance | 12 - 36 Hours |
| **DJB** | Potable water supply, sewer main ruptures, water contamination emergencies | 6 - 24 Hours |
| **DPCC** | Open biomass burning, construction dust violations, hazardous industrial runoff | 6 - 12 Hours |

<br />

## Key Features

- **Atmospheric 3D Earth Stage**: Interactive Three.js globe pinpointing Delhi coordinates (`28.6139° N, 77.2090° E`) with real-time civic telemetry.
- **Problem Track Catalog**: Clean, high-density incident cards modeled after international technical challenges, avoiding visual clutter.
- **Multilingual Snap & Speak**: Real-time parsing of Hinglish voice and colloquial transcripts into formal municipal work orders.
- **Spatial Deduplication**: Real-time clustering algorithm merging duplicate reports across Delhi wards.
- **Visual Fix Buster**: Computer-vision comparison of pre-repair and post-repair site imagery.

<br />

## Technical Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4
- **3D Visualization**: Three.js (custom atmospheric limb shader, orbital camera controls)
- **Icons**: Lucide React
- **AI Processing**: Google Gemini API (Multimodal Vision & JSON Schema structured outputs)
- **Deployment**: Vercel

<br />

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
git clone https://github.com/TECHSCHOLAR777/CIVICSENSE-AI-BY-MEEVAAN-GARG.git
cd CIVICSENSE-AI-BY-MEEVAAN-GARG
npm install
```

### Environment Configuration

Create a `.env.local` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

<br />

## Contributor

- **Meevaan Garg** ([@TECHSCHOLAR777](https://github.com/TECHSCHOLAR777))

<br />

## License

This project is open-source under the MIT License.
