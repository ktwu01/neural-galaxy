## Critical

data points大小由该points的words量决定

使用新的测试对话内容而非我自己的内容


## Middle
如果数量超过fifty MB的话，需要by me coffee any amount

- [ ] As many of the users, they might have like 100 conversations, so this such low number might not be very suitable for creating a nebula or a galaxy. So how about   change our method of considering like ungroup our conversation instead we make a   large word galaxy instead of conversation galaxy. Like each word has its own   particle.

## Small

- [ ] 让cluster之间离得更远一些，现在的3倍. Different color clusters should be more separated spatially. We should have a control panel in a right to control this parameter.(... if it's easy.)


## Solved
Then we should follow the best practice in @jarvis.

- [x] Each individual particle should be more separated spatially. We should have a control panel in the right To control this parameter\(if its techinally easy)

- [x] left right hand flipped (text shown good; img need to be flipped. that is after img flip, the txt should also flip)

- [x] We should have the ability to unlimited zoom in and zoom out.
    - [x] Currently, it is limited to zoom in.

- [x] There is even no need to have a rotation center. Because a rotation center will let us always have to rotate instead of moving horizontally or vertically. This makes moving here and there to be very super hard.

- [x] It seems that zoom in has more effect than zoom out. Change this.

- [x] make the particles larger 3X than current

- [x] if detected hands in left >80 or right >80 (edge condition), do not rotate to avoid misrotate

now explicitly let the algo,
by default: freeze (no rotate, no travel)
[x] 1. when 2 hands detected, freeze travel/rotate. only zoom in/out.
[x] 2. when only one hand detected, grab for ahead, V for back. can do rotate.

- [x] Also change the behavior to where we can only use Cursor and use the mouse if we push the mouse, it will go straight towards the cursor direction. That is, we do not need to zoom in or zoom out using our fingers. This is super super not good practice. It's not like Traveler because travelers they travel like using a speed but if you zoom in zoom out this is like God that's not acceptable. And also, it is too easy for me to accidentally click on one of the particles, and it just stops. Try not to let it stop so quickly. I would like to see the focus panel first. Let the user click twice before showing up the detailed information.This can avoid accidentally clicking.

- [x] no, this is conflict between display/ reality. when i in reality show RIGHT + PINTCH, I see the skeleton detect show correctly the `RIGHT [DOT] PINTCH`, but it might be the system not really detecting/mis-transporting some parameters/arguments. For example, at this time i tell that from top-left panel:   left right hand flipped (text shown good; img need to be flipped. that is after img flip, the txt should also flip). solve this.

- [x] Let gesture info panel be in the buttom-right.

- [x] You act as planner. let's add a global window which shows all the galaxy region. Let this panel be in the buttom left. In the top right, add a back panel to see the location we are at the Galaxy. Just like what GTA does In 2D map, here is 3D (Projected to 2D). Explain to me your plan before doing it.

- [x] no need to do with gesturee  panel. minimap to be                    │
│   circle-bordered(currently rectangle bordered). the annoying thing    │
│   is, the universe is not full screen,   not the panel

- [x] UI: remove Currently annoying feat: is called an "Inset Layout" or a "Floating Viewport." It creates a "window-within-a-window" aesthetic, making the web app feel more like a native OS application or a dashboard.

- [x] SEO: Add LinkedIn (https://www.linkedin.com/in/ktwu01/), X (https://x.com/ktwu01), GitHub Profile (https://github.com/ktwu01/), and GitHub Repo (https://github.com/ktwu01/neural-galaxy) links.
Oh what the fucking shit. It's definitely stupid retard to use emojis as icons. use best practice: use favicons   

## UI Enhancements:
- [x] Make "Neural Galaxy" title very highlighted (larger, shining font).
- [x] Move GitHub repo Fork/Star links to be next to the "Neural Galaxy" title.
- [x] Move social icons (LinkedIn, X, GitHub profile) to be next to the "Settings" toggle icon (outside the panel), and make them clickable.
- [x] Set "Settings Panel" to be folded (closed) by default.

- [x] `focus` Data show in the `focus` panel: It didn't pitch out the correct part of the JSON file that we really want. It just Cut off to get the first part of the Raw Json, this is ugly. Search for this algorithm and change it to Search for this part `"content": {"content_type": "text", "parts": ["` and get the information after this part (If it's not empty. I believe for each conversation we will have at least not empty after `"content": {"content_type": "text", "parts": ["`)

- [x] Add a screenshot button add my name to below

- [x] Add import bottom and preprocess part via browser/connect seamlessly
    - [x] Design UI for file upload/import button
    - [x] Implement file reader for chat history formats (JSON only)
            with description on how to export ?
    - [x] Add data validation and error handling for imported files
    - [x] Implement preprocessing pipeline (tokenization, embedding generation) - *Implemented basic text summarization and random positioning. Full UMAP/clustering is a future task.*
    - [x] Add progress indicator for import/preprocessing workflow

    - [x] Update @CONFIGURATION.md to know that upload = import in our context. And sometimes, the scripts can be named as `upload_xx` instead of `import_xx`.
    - [x] Update galaxy data structure to accept dynamically imported data
    - [x] Test end-to-end import workflow with sample data
