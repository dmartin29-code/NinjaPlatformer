var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  backgroundColor: "#1a1a2e",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 }, // how fast the player falls
      debug: false, // set to true to see physics boxes
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

function preload() {
  // Background grid texture
  this.load.image("grid", "assets/2d/Background/Grid.png");

  // Tiled map (TMX/XML format) and tileset image
  this.load.tilemapXML("posttutorial", "maps/posttutorial.tmx");
  this.load.image("terrain", "assets/2d/Terrain/Terrain (16x16).png");

  // Player assets — defined in player.js
  playerPreload(this);
}

function create() {
  // Build the tilemap from the loaded TMX file
  var map = this.make.tilemap({ key: "posttutorial" });
  // 'terrainForPostTutorial' must match the tileset name inside posttutorial.tmx
  var tileset = map.addTilesetImage("terrainForPostTutorial", "terrain");

  // Grid background — added first so it renders behind everything
  this.add
    .tileSprite(0, 0, map.widthInPixels, map.heightInPixels, "grid")
    .setOrigin(0, 0);

  // Ground tile layer — all non-empty tiles get collision
  var groundLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);
  groundLayer.setCollisionByExclusion([-1]);

  // Raise the tile collision bias to match tile size (16px).
  // This prevents the player from snagging on tile corners while moving horizontally.
  this.physics.world.TILE_BIAS = 32;

  // Jeff's map has no spawnpoints object layer — spawn player at a fixed position
  var player = playerCreate(this, 48, 688, groundLayer);

  // ── Pickups ──────────────────────────────────
  // (posttutorial.tmx has no pickup objects — add them here when ready)
  // ─────────────────────────────────────────────

  // Camera follows the player and stays within the map
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.cameras.main.startFollow(player);
  this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  // Arrow key input
  this.cursors = this.input.keyboard.createCursorKeys();

  // Attach to the scene so update() can access them
  this.player = player;
}

function update() {
  // Movement and animation — defined in player.js
  playerUpdate(this.player, this.cursors);
}
