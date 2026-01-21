# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

【脱单了么】is a single-life tracking app with a cute "dog house" metaphor. Users track their single duration while caring for a virtual dog and decorating their dog house. The core concept transforms "waiting for love" into "investing in oneself" through gamification.

**Key Design Philosophy**: Bright, warm, humorous design. Avoid anxiety/negativity. Focus on self-growth and positive living.

## Commands

```bash
# Development
npm run dev          # Start dev server (Vite, defaults to localhost:3000, auto-opens browser)

# Build
npm run build        # Production build
npm run preview      # Preview production build
```

## Technology Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Build**: Vite 5
- **State**: Pinia (stores pattern)
- **Router**: Vue Router 4
- **Dates**: Day.js
- **Path Alias**: `@` → `src/` directory

## Architecture

### Router Structure

Routes defined in `src/router/routes.js` with lazy-loaded components:
- `/` - Home (我的小窝) - main hub with `keepAlive: true`
- `/onboarding` - Welcome flow (hidden for logged-in users)
- `/room` - House decorator (no tab bar)
- `/shop` - Shop (汪汪市集)
- `/tasks` - Tasks (光荣之爪)
- `/diary` - Diary (爪印日记)
- `/community` - Community (散步广场)
- `/stats` - Stats (数据洞察)
- `/profile` - Profile (个人中心)

Routes use `meta.showTab` to control TabBar visibility.

### State Management Pattern

All stores use Pinia with `defineStore()` accepting either an options object or setup function. Each store:
- Uses `saveToStorage()` / `loadFromStorage()` helpers for persistence
- Has an `initXxx()` async action for loading from localStorage
- Persists state changes via `saveToStorage('storeKey', this.$state)`

**Core Stores**:
- `user` - User profile, start date, settings
- `dog` - Virtual dog (breed, mood, energy, houseItems, accessories)
- `shop` - Items catalog, owned items, purchase logic
- `room` - House decorator state (zones, editing mode, drag-drop)
- `currency` - Bone coins (🦴) economy
- `timer` - Single duration tracking
- `tasks` - Daily task/achievement system
- `diary` - Mood diary entries
- `community` - Social features
- `achievements` - Badge/milestone system

### The Dog House Metaphor

**Core Concept**: The user's single life is represented as a dog caring for its own dog house.

- **Dog** (`dog` store): Represents the user. Has mood, energy, animations. Moods affect displayed animations.
- **House** (`dog.houseLevel`, `dog.houseItems`): Visual representation of life investment
- **Zones** (`HOUSE_ZONES`): Three placement areas - ground (地面), wall (墙面), outdoor (室外)
- **Items** (`SHOP_ITEMS`): Purchasable decorations with `placementZone` defining default area

**Item Placement Flow**:
1. User purchases item in shop → `shop.purchaseItem()`
2. Furniture auto-placed to zone defined by `item.placementZone`
3. Items get `instanceId` (unique) + `itemId` (catalog ID) + `zone` + `position` (%-based)
4. Displayed on home scene and in room decorator (`/room`)

### Data Files

Located in `src/data/`:
- `shopItems.js` - Item catalog with `placementZone` field
  - Categories: `furniture`, `dog-items`, `experiences`, `digital`
  - Types: `furniture`, `accessory`, `toy`, `consumable`, `upgrade`, `skin`
  - Rarities: `common`, `rare`, `epic`, `legendary`
- `houseZones.js` - Zone definitions with bounds (%), default positions, styles
- `dogBreeds.js` - Unlockable dog breeds (time-gated)
- `moods.js` - Mood definitions with associated colors/animations
- `tasks.js` - Daily task definitions
- `achievements.js` - Milestone/badge definitions
- `mockPosts.js` - Sample community posts

### Component Directory

`src/components/` - Shared components organized by domain:
- `charts/` - Chart/visualization components
- `common/` - Generic UI components
- `community/` - Social feature components
- `currency/` - Bone coin display components
- `diary/` - Diary entry components
- `dog/` - Dog-related components
- `task/` - Task/achievement components
- `timer/` - Time display components

### View Structure

- `Home/HomeView.vue` - Main hub with SceneContainer (dog scene) + TabBar
- `Shop/ShopView.vue` - Item catalog with category tabs
- `RoomDecorator/RoomDecoratorView.vue` - House customization interface
- `Tasks/TasksView.vue` - Daily task list
- `Diary/DiaryView.vue` - Mood journal
- `Community/CommunityView.vue` - Social features
- `Stats/StatsView.vue` - Data visualization
- `Profile/ProfileView.vue` - User settings

### Styling System

**CSS Variables** (`src/styles/variables.css`):
- Warm color palette (orange primary, pink accents)
- Quality tiers: common/rare/epic/legendary with distinct border colors
- Mood colors for emotional states
- Spacing scale (`--space-xs` to `--space-3xl`)
- Elastic bounce transitions (`cubic-bezier`)

**Modern UI Design Pattern** (post-2024 update):
- **Background gradients**: Soft pink (#ffe4ec) → blue (#e8f4fd) → green (#d4f1f9)
- **Glassmorphism cards**: `backdrop-filter: blur(10px)` + `rgba(255, 255, 255, 0.9)`
- **Large rounded corners**: 16-24px border-radius for cards
- **Primary brand color**: `#FF8C94` (soft pink) for accents/buttons
- **Hover effects**: `translateY(-4px)` + shadow scale
- **Rarity glow animations**: Pulsing radial gradients for rare/epic/legendary items

**Animations** (`src/styles/animations.css`):
- Dog-specific: `tail-wag`, `jump`, `breathe`
- Cute effects: `cute-bounce`, `wiggle`, `jelly`, `pop-in`
- Game feedback: `coin-earn`, `task-complete`, `achievement-unlock`
- Environmental: `float` (clouds), `sun-glow`, `sway` (flowers)

## Key Implementation Patterns

### Store Inter-Initialization

Stores reference each other via dynamic imports to avoid circular dependencies:

```javascript
const dogStore = useDogStore()  // called within actions, not top-level
```

### Item Data Structure

**Item Types** (SHOP_ITEMS):
```javascript
{
  id, name, category, type, price, icon, description, rarity,
  placementZone,  // for furniture: 'ground' | 'wall' | 'outdoor'
  effect          // for consumables: 'restore_energy' | 'happy_animation'
}
```

**Categories**: `furniture`, `dog-items`, `experiences`, `digital`
**Types**: `furniture`, `accessory`, `toy`, `consumable`, `upgrade`, `skin`
**Rarities**: `common`, `rare`, `epic`, `legendary`

**Placed Item** (dog.houseItems):
```javascript
{
  instanceId,    // unique placement instance
  itemId,        // catalog ID
  zone,          // current zone
  position: { x, y },  // percentage-based position
  placedAt,
  ...itemProps   // all catalog properties spread
}
```

### House Canvas Visual Design

The `HouseCanvas.vue` component renders a cute 3D-perspective house scene:

- **Sky background**: Gradient #87CEEB → #e8f4fd with floating clouds (☁️) and glowing sun (☀️)
- **Grass ground**: Gradient #90EE90 → #6BAA6B at bottom 55%
- **House structure**: Red roof (#FF6B6B), cream walls (#FFF5E6), round blue windows, brown door
- **Garden decor**: Animated flowers (🌸🌼🌷) and bushes (🌿) with sway animation
- **Item cards**: 56px rounded cards with gradient backgrounds, 2px borders by rarity
- **Z-index sorting**: Items sorted by Y-coordinate for proper depth layering

### Zone-Based Positioning & Drag-Drop

Positions are stored as percentages (0-100) for responsive layout. When dragging items across zones:
- `detectZoneByPosition(x, y)` determines current zone from bounds
- Zone bounds defined as `{ x, y, width, height }` in percentages

**Drag Implementation** (Pointer Events, not HTML5 DnD):
```javascript
// In HouseCanvas.vue
handleItemDown(e, item) {
  roomStore.selectItem(item)
  roomStore.startDrag(item, e)
  document.addEventListener('pointermove', handlePointerMove)
  document.addEventListener('pointerup', handlePointerUp)
}

// Position calculation
onDrag(event, canvasRect) {
  const x = ((event.clientX - canvasRect.left) / canvasRect.width) * 100
  const y = 100 - ((event.clientY - canvasRect.top) / canvasRect.height) * 100
  return { x: clampedX, y: clampedY }
}
```

### Purchase Side Effects

When `shop.purchaseItem(itemId)` is called (from `src/stores/shop.js`):
1. Validates item exists and not already owned
2. Deduct currency via `currencyStore.spend(price, item, description)`
3. Add to `shop.ownedItems` with `purchasedAt` timestamp
4. **Type-specific handling**:
   - `furniture`: Auto-place to `item.placementZone` with random offset (±5%) from zone's default position
   - `upgrade`: Call `dogStore.upgradeHouse(houseLevel + 1)`
   - `accessory`: Call `dogStore.addAccessory(item)`
   - `consumable`: Apply effect immediately (e.g., `restore_energy` → `dogStore.restoreEnergy()`)
   - `toy`, `skin`: Only add to owned items
5. Check achievements via `achievementStore.checkAchievements('items_purchased', total)`
6. Persist state to localStorage

## Important File Locations

- `src/stores/` - All Pinia stores
- `src/data/` - Static data (items, zones, breeds, moods, tasks)
- `src/styles/` - CSS variables and animations
- `src/utils/helpers.js` - Storage helpers, ID generation
- `src/views/` - Page components
- `src/views/Home/components/SceneContainer.vue` - Main dog scene with placed items

## User Preferences

From `.claude/CLAUDE.md` (user's global settings):
- Always reply in Chinese
- For web scraping, use locally installed fetch MCP plugin
