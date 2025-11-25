## Critical

Then we should follow the best practice in @jarvis.

- [x] We should have the ability to unlimited zoom in and zoom out.
    - [] Currently, it is limited to zoom in.

This did not make sense when single hand Forward (GRAB gesture). because even when i modify it, it do not change. `grabVelocity: 3.0,       // Forward (GRAB gesture)`

- [x] There is even no need to have a rotation center. Because a rotation center will let us always have to rotate instead of moving horizontally or vertically. This makes moving here and there to be very super hard.

- [x] It seems that zoom in has more effect than zoom out. Change this.

- [x] make the particles larger 3X than current

[-] if detected hands in left >80 or right >80 (edge condition), do not rotate to avoid misrotate

now explicitly let the algo,
by default: freeze (no rotate, no travel)
[x] 1. when 2 hands detected, freeze travel/rotate. only zoom in/out.
[ ] 2. when only one hand detected, grab for ahead, V for back. can do rotate.


- [ ] You act as planner. Our project It's not working correctly. First, let's add a global window which shows all the galaxy region. Let this panel be in the top right. In the top right, add a back panel to see the location we are at the Galaxy. Just like what GTA does In 2D map, here is 3D (Projected to 2D). Explain to me your plan before doing it.

- [ ] Also change the behavior to where we can only use Cursor and use the mouse if we push the mouse, it will go straight towards the cursor direction. That is, we do not need to zoom in or zoom out using our fingers. This is super super not good practice. It's not like Traveler because travelers they travel like using a speed but if you zoom in zoom out this is like God that's not acceptable. And also, it is too easy for me to accidentally click on one of the particles, and it just stops. Try not to let it stop so quickly. I would like to see the focus panel first. Let the user click twice before showing up the detailed information.This can avoid accidentally clicking.

## Middle

- [ ] As many of the users, they might have like 100 conversations, so this such low   number might not be very suitable for creating a nebula or a galaxy. So how about   change our method of considering like ungroup our conversation instead we make a   large word galaxy instead of conversation galaxy. Like each word has its own   particle.


## Small
- [ ] Each individual particle should be more separated spatially. We should have a control panel in the right To control this parameter\(if its techinally easy)

- [ ]   Different color clusters should be less separated spatially. We should have a control panel in a right to control this parameter.(... if it's easy.)

- [ ] left right hand flipped (text shown good; img need to be flipped. that is after img flip, the txt should also flip)