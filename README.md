# Haltman.IO Website

<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/65c80447-8070-4be3-8bc4-70060f4c93bc" />

This is the Next.js codebase used to build the Haltman.IO website.

## What Haltman.IO Is

Haltman.IO is an independent Brazilian hacker collective built the hard way: time, scars, broken machines, dead projects, ruined sleep schedules, and more than a decade of crossing paths without turning into a startup cosplay circus.

No hype. No investors. No pitch deck diarrhea. No LinkedIn enlightenment thread about “building in public.” No growth obsession. No invoices. No polished corporate schizophrenia pretending to be culture.

Just mutual aid, practical work, infrastructure, review, and people who still show up when something matters.

We passed through other groups. Some rotted. Some vanished. Some sold out. Some got stupid. Some got captured by ego, politics, paranoia, or cops. We left when transparency stopped mattering, when free knowledge stopped being non-negotiable, and when free software started getting treated like a marketing prop.

So we forked the social layer and built our own crew.

We are old-school hackers.  
Unaffiliated. Unbought. Unfranchised. Uninterested in inherited baggage.

We publish openly.  
We do not play mascot for closed ecosystems.  
We are not for hire.

## Why This Exists

We looked around and found the usual landfill:

soulless templates, startup sludge, fake-minimalist SaaS layouts, corporate dark mode with zero personality, and enough “premium UI kits” to make a sane person want to brick a monitor.

So we built this from scratch.

It is open source. It is released under [The Unlicense](./LICENSE). It is free. Take it, fork it, gut it, improve it, repaint it, slap your name on it, sell it to some agency full of UI philosophers and Slack addicts. We do not care.

Use it.

This thing exists because nothing out there looked like us, sounded like us, or deserved to represent us.

And from the bottom of our black terminal window, to anyone trying to poison open source with license games, restriction theater, fake openness, or “source available” clown tricks:

fuck you.

<img width="300" height="300" alt="image" src="https://github.com/user-attachments/assets/9962492f-0bd3-48ed-83f6-05e035afbf04" />


## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
````

Then open:

[http://localhost:3000](http://localhost:3000)

Useful commands:

* `npm run build`
* `npm run start`
* `npm run lint`
* `npm run blog-images:prepare`

## Blog Image Adapter

The blog can resolve local MDX image references through an adapter layer before `dev` and `build`.

Use relative paths inside blog posts, for example:

```mdx
<PostImage
	src="./my-post/diagram.svg"
	alt="Short accessible description"
	caption="Longer explanation rendered below the image."
/>
```

Markdown image syntax also works:

```mdx
![Packet flow diagram](./my-post/diagram.svg)
```

By default, the adapter runs in local mode. It copies referenced blog images into `/public/__generated/blog-images/` and resolves them during rendering, which keeps the source images outside `public` while preserving a working open-source build.

To enable Cloudflare Hosted Images instead of the local fallback, set:

```bash
BLOG_IMAGE_ADAPTER=cloudflare
CLOUDFLARE_IMAGES_ACCOUNT_ID=your_account_id
CLOUDFLARE_IMAGES_API_TOKEN=your_images_api_token
# optional, defaults to public
CLOUDFLARE_IMAGES_VARIANT=public
```

When Cloudflare mode is enabled, the adapter:

* uploads local blog images to Cloudflare Images before the Next.js build starts
* avoids duplicate uploads by using deterministic custom IDs derived from the file path and content hash
* reuses an existing hosted image when that exact asset is already present
* resolves the hosted delivery URL into the static render that follows

Generated adapter artifacts are written to `/.generated/blog-image-manifest.json` and ignored from git.
