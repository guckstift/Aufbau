const tilesize = 32;
const mapsize = 16;

function create_map()
{
	let terra = new Uint8Array(mapsize * mapsize);
	let objs = new Array(mapsize * mapsize);
	let owners = new Array(mapsize * mapsize);
	let lights = new Uint8Array(mapsize * mapsize);
	
	return {terra, objs, owners, lights, draw: draw_map, extend_prop};
}

function extend_prop(player, cx, cy, radius)
{
	for(let y = cy - radius; y <= cy + radius; y++) {
		if(y < 0 || y >= mapsize) continue;
		for(let x = cx - radius; x <= cx + radius; x++) {
			if(x < 0 || x >= mapsize) continue;
			let index = x + y*mapsize;
			let d = (y - cy)**2 + (x - cx)**2;
			if(d >= (radius+1)**2) continue;
			this.lights[index] |= 1;
			if(d >= radius**2) continue;
			this.lights[index] |= 2;
			if(!map.owners[index]) this.owners[index] = player;
		}
	}
}

function draw_map(imgs)
{
	let {startx, starty, endx, endy} = get_draw_bounds();
	
	for(let y=starty; y<=endy; y++) {
		for(let x=startx; x<=endx; x++) {
			let index = x + y*mapsize;
			if(this.lights[index] == 0) continue;
			let t = this.terra[index];
			let sx = t * 32;
			let sy = 0;
			
			if(this.lights[index] == 1) ctx.globalAlpha = 0.5;
			ctx.drawImage(
				imgs.terra,
				sx, sy, 32, 32, x * 32 - camx, y * 32 - camy, 32, 32
			);
			ctx.globalAlpha = 1;
		}
	}
	
	for(let y=starty; y<=endy; y++) {
		for(let x=startx; x<=endx; x++) {
			let index = x + y*mapsize;
			if(this.lights[index] == 0) continue;
			let obj = this.objs[index];
			let own = this.owners[index];
			let fence_col_offs = 0;
			
			if(curx == x && cury == y) {
				ctx.strokeStyle = "#f0f";
				ctx.strokeRect(
					curx * 32 - camx + 0.5, cury * 32 - camy + 0.5, 31, 31
				);
			}
			
			if(own > 0) {
				fence_col_offs = (own-1) * 32;
				let own_t = this.owners[index - mapsize];
				if(own_t != own) {
					ctx.drawImage(imgs.fence, 5 + fence_col_offs, 14, 24, 5,
					x * 32 - camx + 5, y * 32 - camy - 2, 24, 5);
				}
			}
			
			if(obj) {
				obj.draw(imgs.obj);
			}
			
			if(own > 0) {
				let own_l = this.owners[index - 1];
				let own_r = this.owners[index + 1];
				let own_b = this.owners[index + mapsize];
				if(own_l != own) {
					ctx.drawImage(imgs.fence,  + fence_col_offs, 16, 4, 26,
					x * 32 - camx, y * 32 - camy, 4, 26);
				}
				if(own_r != own) {
					ctx.drawImage(imgs.fence, 28 + fence_col_offs, 19, 4, 26,
					x * 32 - camx + 28, y * 32 - camy + 3, 4, 26);
				}
				if(own_b != own) {
					ctx.drawImage(imgs.fence, 3 + fence_col_offs, 43, 24, 5,
					x * 32 - camx + 3, y * 32 - camy + 27, 24, 5);
				}
			}
		}
	}
}

function get_draw_bounds()
{
	return {
		startx: Math.max(0, Math.floor(camx / 32) - 1),
		starty: Math.max(0, Math.floor(camy / 32)),
		endx: Math.min(mapsize - 1, Math.floor((camx + 800) / 32)),
		endy: Math.min(mapsize - 1, Math.floor((camy + 600) / 32) + 1),
	};
}
