// Disk Scheduling Algorithms
export const fcfs = (requests, initialPosition) => {
  const sequence = [...requests].sort((a, b) => a.order - b.order).map(r => r.position);
  const path = [initialPosition, ...sequence];
  const totalSeekTime = path.reduce((acc, curr, i) => {
    if (i === 0) return 0;
    return acc + Math.abs(curr - path[i - 1]);
  }, 0);
  return { sequence, totalSeekTime, path };
};

export const sstf = (requests, initialPosition) => {
  let current = initialPosition;
  const sequence = [];
  const path = [initialPosition];
  let unserviced = [...requests];
  let totalSeekTime = 0;

  while (unserviced.length > 0) {
    const closest = unserviced.reduce((prev, curr) => 
      Math.abs(curr.position - current) < Math.abs(prev.position - current) ? curr : prev
    );
    sequence.push(closest.position);
    path.push(closest.position);
    totalSeekTime += Math.abs(closest.position - current);
    current = closest.position;
    unserviced = unserviced.filter(r => r !== closest);
  }

  return { sequence, totalSeekTime, path };
};

export const scan = (requests, initialPosition, diskSize = 199, direction = 'right') => {
  const sequence = [];
  const path = [initialPosition];
  let totalSeekTime = 0;
  
  const positions = [...new Set(requests.map(r => r.position))].sort((a, b) => a - b);
  const head = initialPosition;
  
  if (direction === 'right') {
    // Move right
    const rightSide = positions.filter(pos => pos >= head);
    const leftSide = positions.filter(pos => pos < head);
    
    sequence.push(...rightSide, diskSize, ...leftSide.reverse());
    path.push(...rightSide, diskSize, ...leftSide.reverse());
  } else {
    // Move left
    const leftSide = positions.filter(pos => pos <= head).reverse();
    const rightSide = positions.filter(pos => pos > head).reverse();
    
    sequence.push(...leftSide, 0, ...rightSide);
    path.push(...leftSide, 0, ...rightSide);
  }
  
  totalSeekTime = path.reduce((acc, curr, i) => {
    if (i === 0) return 0;
    return acc + Math.abs(curr - path[i - 1]);
  }, 0);

  return { sequence, totalSeekTime, path };
};

export const cscan = (requests, initialPosition, diskSize = 199) => {
  const sequence = [];
  const path = [initialPosition];
  let totalSeekTime = 0;
  
  const positions = [...new Set(requests.map(r => r.position))].sort((a, b) => a - b);
  const head = initialPosition;
  
  const rightSide = positions.filter(pos => pos >= head);
  const leftSide = positions.filter(pos => pos < head);
  
  sequence.push(...rightSide, diskSize, 0, ...leftSide);
  path.push(...rightSide, diskSize, 0, ...leftSide);
  
  totalSeekTime = path.reduce((acc, curr, i) => {
    if (i === 0) return 0;
    return acc + Math.abs(curr - path[i - 1]);
  }, 0);

  return { sequence, totalSeekTime, path };
};

export const look = (requests, initialPosition, direction = 'right') => {
  const sequence = [];
  const path = [initialPosition];
  let totalSeekTime = 0;
  
  const positions = [...new Set(requests.map(r => r.position))].sort((a, b) => a - b);
  const head = initialPosition;
  
  if (direction === 'right') {
    const rightSide = positions.filter(pos => pos >= head);
    const leftSide = positions.filter(pos => pos < head);
    
    sequence.push(...rightSide, ...leftSide.reverse());
    path.push(...rightSide, ...leftSide.reverse());
  } else {
    const leftSide = positions.filter(pos => pos <= head).reverse();
    const rightSide = positions.filter(pos => pos > head).reverse();
    
    sequence.push(...leftSide, ...rightSide);
    path.push(...leftSide, ...rightSide);
  }
  
  totalSeekTime = path.reduce((acc, curr, i) => {
    if (i === 0) return 0;
    return acc + Math.abs(curr - path[i - 1]);
  }, 0);

  return { sequence, totalSeekTime, path };
};

export const clook = (requests, initialPosition) => {
  const sequence = [];
  const path = [initialPosition];
  let totalSeekTime = 0;
  
  const positions = [...new Set(requests.map(r => r.position))].sort((a, b) => a - b);
  const head = initialPosition;
  
  const rightSide = positions.filter(pos => pos >= head);
  const leftSide = positions.filter(pos => pos < head);
  
  sequence.push(...rightSide, ...leftSide);
  path.push(...rightSide, ...leftSide);
  
  totalSeekTime = path.reduce((acc, curr, i) => {
    if (i === 0) return 0;
    return acc + Math.abs(curr - path[i - 1]);
  }, 0);

  return { sequence, totalSeekTime, path };
};