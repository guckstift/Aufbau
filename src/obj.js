const obj_tpls = {
	tree: { name: "tree", sx: 0, sy: 0, w: 64, h: 64, ax: 16, ay: 48 },
	
	tower: {
		name: "tower", img: "building",
		sx: 0, sy: 0, w: 64, h: 64, ax: 16, ay: 48
	},
	
	settler: {
		name: "settler", img: "settler",
		//sx: 0, sy: 0, w: 16, h: 32,
		ax: 8, ay: 16,
		frames: [
			[0,0, 16,32], [16,0, 16,32], [32,0, 16,32], [48,0, 16,32],
			[0,32, 16,32], [16,32, 16,32], [32,32, 16,32], [48,32, 16,32],
			[0,64, 16,32], [16,64, 16,32], [32,64, 16,32], [48,64, 16,32],
			[0,96, 16,32], [16,96, 16,32], [32,96, 16,32], [48,96, 16,32],
			[0,128, 16,32], [16,128, 16,32], [32,128, 16,32], [48,128, 16,32],
		],
		anis: {
			walk_d: [4,5,6,7],
			walk_u: [8,9,10,11],
			walk_r: [12,13,14,15],
			walk_l: [16,17,18,19],
		},
	},
};

const ware_tpls = [
	{name: "wood", frames: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]},
	{name: "axe", frames: [[0,1],[1,1],[2,1],[3,1]]},
];

ware_tpls.forEach(tpl => {
	obj_tpls[tpl.name] = {
		name: tpl.name, img: "ware", ax: 16, ay: 16,
		frames: tpl.frames.map(f => [f[0] * 32, f[1] * 32, 32, 32]),
	};
});

const obj_proto = {
	frame: 0,
	framex: 0,
	framey: 0,
	dx: 0,
	dy: 0,
	x: 0,
	y: 0,
	ani: null,
	
	play_ani(name)
	{
		let new_ani = this.anis[name];
		if(this.ani === new_ani) return;
		this.ani = this.anis[name];
		this.anistep = 0;
		this.frame = this.ani[this.anistep];
	},
	
	stop_ani()
	{
		this.ani = null;
		this.anistep = 0;
	},
	
	put(x, y)
	{
		map.objs[this.x + this.y * mapsize] = null;
		
		this.x = x;
		this.y = y;
		
		if(this.name === "tower") {
			map.extend_prop(this.player, x, y, 5);
		}
		
		map.objs[x + y * mapsize] = this;
		return this;
	},
	
	draw(obj_img)
	{
		if(this === selected) {
			ctx.strokeStyle = "#0f0";
			ctx.strokeRect(
				this.x * 32 - camx + 0.5 + this.dx,
				this.y * 32 - camy + 0.5 + this.dy,
				31, 31
			);
		}
		
		if(this.frames) {
			let frame = this.frames[this.frame];
			
			ctx.drawImage(
				this.img,
				frame[0], frame[1], frame[2], frame[3],
				this.x * 32 - camx - this.ax + tilesize / 2 + this.dx,
				this.y * 32 - camy - this.ay + tilesize / 2 + this.dy,
				frame[2], frame[3],
			);
		}
		else {
			ctx.drawImage(
				this.img,
				this.sx + this.framex * this.w,
				this.sy + this.framey * this.h,
				this.w, this.h,
				this.x * 32 - camx - this.ax + tilesize / 2 + this.dx,
				this.y * 32 - camy - this.ay + tilesize / 2 + this.dy,
				this.w, this.h,
			);
		}
		
		if(this.ani) {
			this.anistep = this.anistep + 0.125;
			if(this.anistep >= this.ani.length) this.anistep = 0;
			this.frame = this.ani[this.anistep | 0];
		}
	},
};

function create_obj(imgs, name)
{
	let obj = Object.create(obj_proto);
	Object.assign(obj, obj_tpls[name]);
	
	if(obj.img) {
		obj.img = imgs[obj.img];
	}
	else {
		obj.img = imgs.obj;
	}
	
	return obj;
}

function create_tower(imgs, player)
{
	let tower = create_obj(imgs, "tower");
	tower.player = player;
	return tower;
}
