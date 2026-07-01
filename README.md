# Shingler Homes — Shopify Theme

Dawn 15.5.0 theme customised for the Shingler Homes website redesign, aligned with the Shingler Construction visual identity and brand style guide.

## Brand

| Token | Value |
|-------|-------|
| Cream | `#FAF1E9` |
| White | `#FFFFFF` |
| Yellow accent | `#F7C349` |
| Dark | `#201B17` |
| Font | Inter |

Brand CSS lives in `assets/shingler-brand.css`. Reusable UI components are in `snippets/shingler-*.liquid`.

## CMS Setup (Shopify Admin)

### 1. Logos

Go to **Theme settings → Logo**:

- **Logo** — dark version for cream/light backgrounds
- **Logo (light)** — light version for dark backgrounds (announcement bar, hero overlays)
- Upload favicon

### 2. Navigation

Create menus in **Online Store → Navigation**:

- **header-menu** — main site navigation (assigned in Header section)
- **Footer menu** — developments links, company links, policies

Assign **header-menu** in the header section (Theme Editor). Set **Desktop menu type** to **Mega menu**.

#### Header mega-menu structure

The **Developments** item uses a rich card layout (thumbnail, location, title). Nest it **three levels deep**:

```
Developments
├── Current Developments          (column heading — use # if not a link)
│   ├── Meadowbrook Gardens       → development collection
│   └── Oakfield Place            → development collection
└── Signature Developments        (column heading)
    ├── Bishops Gate              → development collection
    └── Victoria Works            → development collection
```

**Company**, **Buying With Us**, and other dropdowns use text columns (level 2 = column heading, level 3 = links):

```
Company
├── About Us
├── Our Team
└── Our History
```

Top-level items without children (Apprenticeships, Gallery, News) are plain links.

In **Header → Mega menu card layout handle**, enter `developments` (must match the Developments menu item handle).

On desktop, mega-menu panels open on **hover** (keyboard focus still works). Mobile uses the drawer accordion.

The mega-menu appears as a **centered floating panel** below the header with a **dimmed backdrop** over the page content. Click the backdrop to close.

#### Collection location metafield

For development thumbnails and locations in the mega-menu, add a collection metafield:

1. **Settings → Custom data → Collections → Add definition**
2. Name: **Location**, type: **Single line text**, namespace/key: `custom.location`
3. On each development collection, set **Location** (e.g. `Shrewsbury, Shropshire`) and upload a **featured image**

The mega-menu reads the collection image and `custom.location` from each linked collection automatically.

### 3. Developments (Collections)

Each development is a **Collection** (e.g. Bridleways, The Acorns):

1. Create collection with description and featured image
2. Assign template **collection.development**
3. In Theme Editor, open the collection page and configure:
   - **Development hero** — eyebrow, description override, hero image
   - **Register interest form** — pre-fills development name from collection
   - **Sales contact** — negotiator name, email, phone

On the homepage, link each block in **Shingler developments** to its collection.

### 4. House types / plots (optional)

If individual plot pages are needed:

1. Create products for house types
2. Assign template **product.plot** (enquiry form, no cart)
3. Link from development collection pages

### 5. Pages

| Page | Template |
|------|----------|
| About / Shingler Group | `page.about` |
| Buying With Us | `page.buying` |
| Contact | `page.contact` |

Create pages in **Online Store → Pages** and assign the template under **Theme template**.

### 6. News & events

Create a blog called **news** (handle: `news`). Homepage **Featured blog** section pulls from this blog.

### 7. Announcement bar

Edit in Theme Editor → Header group → Announcement bar. Add rotating open morning / event messages.

### 8. Photography

Upload hero and development images via:

- Homepage **Image banner** section
- Collection featured images
- Section image pickers in Theme Editor

Replace placeholders when Holly's Drive assets are available.

## Theme Editor Sections

| Section | Purpose |
|---------|---------|
| Image banner | Homepage / page heroes |
| Shingler developments | Homepage development grid |
| Shingler development hero | Collection page hero |
| Register interest form | Enquiry forms |
| Sales contact | Sales negotiator details |
| Image with text | Shingler Group block |
| Featured blog | News & events |
| Newsletter | Email signup |

## Development

```bash
shopify theme dev
```

Key files:

- `config/settings_data.json` — color schemes, fonts (Inter)
- `templates/index.json` — homepage structure
- `templates/collection.development.json` — development landing pages
- `sections/shingler-*.liquid` — custom Shingler sections

## Cart

Cart icon is hidden by default (`Theme settings → Shingler → Show cart icon`). Enable only if e-commerce is required.
