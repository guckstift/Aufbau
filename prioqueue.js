function pq_push(pq, item, prio)
{
	let node = [item, prio];
	let index = pq.length;
	pq.push(node);
	
	while(index > 0) {
		let pindex = index - 1 >> 1;
		let parent = pq[pindex];
		let [pitem, pprio] = parent;
		
		if(prio < pprio) {
			pq[pindex] = node;
			pq[index] = parent;
			index = pindex;
		}
		else {
			break;
		}
	}
}

function pq_pop(pq)
{
	if(pq.length === 0) {
		return;
	}
	
	let node = pq[0];
	let last = pq.pop();
	let [item, prio] = last;
	let index = 0;
	
	while(index < pq.length) {
		let lindex = (index << 1) + 1;
		let rindex = (index << 1) + 2;
		
		if(lindex < pq.length && prio > pq[lindex][1]) {
			let temp = pq[lindex];
			pq[lindex] = last;
			pq[index] = temp;
			index = lindex;
		}
		else if(rindex < pq.length && prio > pq[rindex][1]) {
			let temp = pq[rindex];
			pq[rindex] = last;
			pq[index] = temp;
			index = rindex;
		}
		else {
			pq[index] = last;
			break;
		}
	}
	
	return node[0];
}
