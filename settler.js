
let settler_proto = create_obj("settler");

Object.assign(settler_proto, {
	moving: false,
	vx: 0,
	vy: 0,
	ex: 0,
	ey: 0,
	dir: false,
	steps: 0,
	
	go(dir) {
		this.stop();
		this.moving = true;
		this.vx = dir[0];
		this.vy = dir[1];
		this.ex = 32 * dir[0];
		this.ey = 32 * dir[1];
		
		this.framex = (
			dir[0] > 0 ? 1 :
			dir[0] < 0 ? 2 :
			dir[1] > 0 ? 0 :
			dir[1] < 0 ? 3 :
			0
		);
	},
	
	go_line(dir, steps)
	{
		this.dir = dir;
		this.steps = steps - 1;
		this.go(dir);
	},
	
	stop()
	{
		if(this.moving) {
			this.moving = false;
			this.framex = 0;
			this.vx = 0;
			this.vy = 0;
			this.ex = 0;
			this.ey = 0;
			this.dx = 0;
			this.dy = 0;
		}
	},
	
	update() {
		this.dx += this.vx;
		this.dy += this.vy;
		
		if(this.moving) {
			if(
				this.vx > 0 && this.dx >= this.ex ||
				this.vx < 0 && this.dx <= this.ex ||
				this.vy > 0 && this.dy >= this.ey ||
				this.vy < 0 && this.dy <= this.ey
			) {
				this.put(this.x + this.vx, this.y + this.vy);
				this.stop();
				
				if(this.steps) {
					this.steps --;
					this.go(this.dir);
				}
			}
		}
	},
});

function create_settler(player)
{
	let settler = Object.create(settler_proto);
	settler.player = player;
	player.settlers.push(settler);
	return settler;
}
