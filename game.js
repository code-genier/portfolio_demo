let config = {
  type: Phaser.AUTO,
  scale: {
    width: 850,
    height: 650,
    mode: Phaser.Scale.Fit,
  },
  // phy6
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 1000,
      },
      //debug: true,
    },
  },

  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);

function preload() {
  this.load.image("background", "Assets/bg.png");
  this.load.image("ground", "Assets/ground.png");
  this.load.spritesheet("player_idle", "Assets/person.png", {
    frameWidth: 899,
    frameHeight: 1456,
  });
  this.load.spritesheet("player_left", "Assets/left.png", {
    frameWidth: 899,
    frameHeight: 1456,
  });
  this.load.image("up", "Assets/up.png");
  this.load.image("box", "Assets/box.png");
  this.load.image("arrow", "Assets/arrow.png");
  this.load.image("tree", "Assets/tree.png");
  this.load.image("bush", "Assets/bush.png");
  this.load.image("mushroom", "Assets/mushroom.png");
}

function create() {
  let w = game.config.width;
  let h = game.config.height;

  // background
  this.add.image(390, 300, "background");

  //corner a - part of collison handelling (right side)
  let c = this.physics.add.staticSprite(w, 580, "box");
  c.setScale(0.01, w);
  c.refreshBody();

  // ground
  let ground = this.add.tileSprite(0, h - 50, w, 128, "ground");
  ground.setScale(1, 0.4);
  ground.setOrigin(0, 0);

  //player
  this.player = this.physics.add.sprite(10, 550, "player_idle", 1);
  this.player.setScale(0.04, 0.04, true);
  this.physics.add.existing(ground, true);

  // platforms
  let platform = this.physics.add.staticGroup();
  platform.create(760, 580, "ground").setScale(1.4, 0.3).refreshBody();
  platform.create(790, 540, "ground").setScale(1.2, 0.3).refreshBody();
  platform.create(820, 500, "ground").setScale(1.2, 0.3).refreshBody();
  //platform.create(600, 400, "p1").setScale(2, 0.6).refreshBody();

  //floor
  let floor = this.add.tileSprite(0, h - 210, w - 180, 70, "up");
  floor.setScale(1, 0.8);
  floor.setOrigin(0, 0);
  this.physics.add.existing(floor, true);

  //collisioh handelling
  this.physics.add.collider(ground, this.player);
  this.physics.add.collider(platform, this.player);
  this.physics.add.collider(c, this.player);
  this.physics.add.collider(floor, this.player);

  //bounce effect
  this.player.setBounce(0.3);
  this.player.setCollideWorldBounds(true, 0, 0);

  cursors = this.input.keyboard.createCursorKeys();
  //animations
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("player_idle", {
      start: 0,
      end: 10,
    }),
  });
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("player_left", {
      start: 0,
      end: 10,
    }),
  });

  //camera
  this.cameras.main.setBounds(0, 0, w, h);
  this.physics.world.setBounds(0, 0, 2 * w, h);
  this.cameras.main.startFollow(this.player, true, true);
  this.cameras.main.setZoom(1.5);

  //addtional objects
  let tree = this.physics.add.staticSprite(850, 448, "bush");
  tree.setScale(1, 1);
  let arrow = this.physics.add.staticSprite(820, 465, "arrow");
  arrow.setScale(0.5, 0.5);
  let mushroom = this.physics.add.staticSprite(840, 469, "mushroom");
  mushroom.setScale(0.6, 0.5);
}

function update() {
  //cursors = this.input.keyboard.createCursorKeys();
  if (cursors.right.isDown) {
    this.player.setVelocityX(150);
    this.player.anims.play("right", true);
  } else if (cursors.left.isDown) {
    this.player.setVelocityX(-150);
    this.player.anims.play("left", true);
  } else {
    this.player.setVelocityX(0);
  }

  if (cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-400);
  }
}
