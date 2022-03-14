const obj_tpls = {
	tree: { name: "tree", sx: 0, sy: 0, w: 64, h: 64, ax: 16, ay: 48 },
	tower: { name: "tower", sx: 0, sy: 64, w: 64, h: 64, ax: 16, ay: 48 },
	settler: { name: "settler", sx: 0, sy: 128, w: 16, h: 32, ax: 8, ay: 16 },
};

const obj_proto = {
	framex: 0,
	framey: 0,
	dx: 0,
	dy: 0,
	x: 0,
	y: 0,
	put(x, y)
	{
		objmap[this.x + this.y * mapsize] = null;
		
		this.x = x;
		this.y = y;
		
		if(this.name === "tower") {
			extend_prop(this.player, x, y, 5);
		}
		
		objmap[x + y * mapsize] = this;
		return this;
	},
	draw(obj_img)
	{
		ctx.drawImage(
			obj_img,
			this.sx + this.framex * this.w,
			this.sy + this.framey * this.h,
			this.w, this.h,
			this.x * 32 - camx - this.ax + tilesize / 2 + this.dx,
			this.y * 32 - camy - this.ay + tilesize / 2 + this.dy,
			this.w, this.h,
		);
	},
};

function create_obj(name)
{
	let obj = Object.create(obj_proto);
	Object.assign(obj, obj_tpls[name]);
	return obj;
}

function create_tower(player)
{
	let tower = create_obj("tower");
	tower.player = player;
	return tower;
}
