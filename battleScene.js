// ============================================
// BATTLE SYSTEM
// ============================================
function checkBattleZoneCollision() {
    player.moving = false;

    // Check if any movement keys are pressed
    if (!(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed)) {
        return;
    }

    for (let i = 0; i < battleZones.length; i++) {
        const battleZone = battleZones[i];

        // Skip if already initiated or no collision
        if (battleZone.initiated || !rectangularCollision({
            rectangle1: player,
            rectangle2: battleZone
        })) {
            continue;
        }

        // Calculate overlapping area
        const overlappingArea =
            (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width)
                - Math.max(player.position.x, battleZone.position.x)) *
            (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height)
                - Math.max(player.position.y, battleZone.position.y));

        // Check if player is mostly in battle zone and random chance triggers
        if (overlappingArea > player.width * player.height / 2 && Math.random() < 0.01) {
            initiateBattle(battleZone);
            break;
        }
    }
}

function initiateBattle(battleZone) {
    window.cancelAnimationFrame(animationId);
    battleZone.initiated = true;

    gsap.to('#overlappingDiv', {
        opacity: 1,
        repeat: 3,
        yoyo: true,
        duration: 0.4,
        onComplete() {
            gsap.to('#overlappingDiv', {
                opacity: 1,
                duration: 0.4,
                onComplete: () => {
                    animateBattle();
                    gsap.to('#overlappingDiv', {
                        opacity: 0,
                        duration: 0.4
                    });
                }
            });
        }
    });
}

// ============================================
// ATTACK SYSTEM
// ============================================
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML];
        emby.attack({
            attack: selectedAttack,
            recipient: mushy,
            renderedSprites
        });
    });
});

