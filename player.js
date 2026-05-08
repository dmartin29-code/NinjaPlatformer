// ─────────────────────────────────────────────
//  player.js — Dragon Cowboy character
//  Edit this file to change how the player looks and feels.
// ─────────────────────────────────────────────

// ── Tuning values ──────────────────────────────
var PLAYER_SPEED = 220; // horizontal move speed (pixels/sec)
var PLAYER_JUMP = -500; // jump velocity — more negative = higher jump
var PLAYER_CHAR = "Sigma";

// The character sprite sheet is loaded from assets/Sigma.png (8 frames, single row).
// Adjust DRAGON_SCALE to make it bigger or smaller on screen.
var DRAGON_SCALE = 1.33; // ~1/3 larger than the base 28x32 size

// Physics hitbox — set in world pixels (independent of sprite scale).
// Enable debug: true in game.js to see the green box while tuning.
var PLAYER_HITBOX_WIDTH = 24; // world pixels wide
var PLAYER_HITBOX_HEIGHT = 28; // world pixels tall

// Glide — hold F in the air to slow the dragon's fall
var GLIDE_FALL_SPEED = 60; // max downward velocity while gliding (px/s)

// ── Asset loading ──────────────────────────────
// Called from preload() in game.js
function playerPreload(scene) {
  // Load the character sprite sheet — 7 frames in a single row, each frame 32x32 px
  scene.load.spritesheet("dragon", "assets/Sigma.png", {
    frameWidth: 32, // 224px total / 7 frames
    frameHeight: 32,
  });

  scene.load.audio(
    "jump-sfx",
    "assets/audio/GameSFX/Bounce Jump/Retro Jump Simple C2 02.wav",
  ); // jump sound effect
}

// ── Revolver sprite drawing ──────────────────────────────────────
// Creates a 20×16 pixel-art revolver sprite (cowboy style).
function generateRevolverTexture(scene) {
  var g = scene.add.graphics();

  // Barrel
  g.fillStyle(0x666666, 1);
  g.fillRect(8, 5, 10, 3);
  g.fillStyle(0x888888, 1);
  g.fillRect(17, 5, 2, 3);

  // Cylinder
  g.fillStyle(0x555555, 1);
  g.fillRect(7, 4, 4, 5);
  g.fillStyle(0x444444, 1);
  g.fillCircle(9, 7, 1);

  // Frame
  g.fillStyle(0x666666, 1);
  g.fillRect(6, 6, 5, 2);

  // Handle (wood)
  g.fillStyle(0xb8860b, 1); // golden brown
  g.fillRect(5, 7, 4, 6);
  g.fillStyle(0x8b6914, 1); // darker shading
  g.fillRect(6, 8, 2, 4);

  // Trigger
  g.fillStyle(0x555555, 1);
  g.fillRect(7, 8, 1, 2);

  g.generateTexture("revolver", 20, 16);
  g.destroy();
}

// ── Create player sprite + animations ──────────
// Called from create() in game.js. Returns the player sprite.
function playerCreate(scene, x, y, groundLayer) {
  // Generate revolver texture if needed
  if (!scene.textures.exists("revolver")) {
    generateRevolverTexture(scene);
  }

  var player = scene.physics.add.sprite(x, y, "dragon");

  // Scale the character sprite to fit the game world
  player.setScale(DRAGON_SCALE);
  player.setCollideWorldBounds(true); // can't walk off the edge of the map

  // Fix the physics hitbox to a consistent world-pixel size.
  player.body.setSize(PLAYER_HITBOX_WIDTH, PLAYER_HITBOX_HEIGHT);

  // Walk animation — cycles through all 7 frames while the player is moving
  scene.anims.create({
    key: "dragon-walk",
    frames: scene.anims.generateFrameNumbers("dragon", { start: 0, end: 6 }),
    frameRate: 10, // frames per second — raise to speed up, lower to slow down
    repeat: -1, // loop forever
  });

  // Collide with ground tiles
  scene.physics.add.collider(player, groundLayer);

  // F key for gliding — stored on the player so playerUpdate can read it
  player.glideKey = scene.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.F,
  );

  // G key to draw / holster the revolver
  player.gunKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);

  // Revolver companion sprite — follows player, shown when gun is drawn
  var gunSprite = scene.add.image(x, y, "revolver");
  gunSprite.setScale(DRAGON_SCALE);
  gunSprite.setVisible(false); // starts holstered
  player.gunSprite = gunSprite;
  player.gunDrawn = false;

  return player;
}

// ── Movement + animation each frame ────────────
// Called from update() in game.js.
function playerUpdate(player, cursors) {
  var onGround = player.body.blocked.down; // true when standing on a tile
  var crouching = cursors.down.isDown && onGround; // crouch only while on ground
  var gliding = !onGround && player.glideKey.isDown; // glide only while airborne

  // Left / right movement — blocked while crouching
  if (!crouching && cursors.left.isDown) {
    player.setVelocityX(-PLAYER_SPEED);
    player.setFlipX(true); // face left
    player.play("dragon-walk", true); // play walk animation (true = don't restart if already playing)
  } else if (!crouching && cursors.right.isDown) {
    player.setVelocityX(PLAYER_SPEED);
    player.setFlipX(false); // face right
    player.play("dragon-walk", true); // play walk animation
  } else {
    player.setVelocityX(0);
    player.anims.stop(); // stop animating — hold on current frame
    player.setFrame(0); // snap back to the first frame as the idle pose
  }

  // Jump — allowed from both standing and crouching
  if (cursors.up.isDown && onGround) {
    player.setVelocityY(PLAYER_JUMP);
  }

  // Glide — hold F to slow the dragon's fall (cap downward velocity)
  if (gliding && player.body.velocity.y > GLIDE_FALL_SPEED) {
    player.setVelocityY(GLIDE_FALL_SPEED);
  }

  // Play jump sound once per keypress (JustDown prevents repeating every frame)
  if (Phaser.Input.Keyboard.JustDown(cursors.up) && onGround) {
    player.scene.sound.play("jump-sfx");
  }

  // G key toggles the revolver drawn/holstered
  if (Phaser.Input.Keyboard.JustDown(player.gunKey)) {
    player.gunDrawn = !player.gunDrawn;
    player.gunSprite.setVisible(player.gunDrawn);
  }

  // Update revolver sprite to follow the player
  if (player.gunDrawn) {
    var facing = player.flipX ? -1 : 1; // -1 = left, 1 = right
    // Position the gun at the dragon's hand level, extended forward
    player.gunSprite.x = player.x + facing * 28;
    player.gunSprite.y = player.y + 6;
    player.gunSprite.setFlipX(player.flipX); // mirror gun to match direction
  }
}
