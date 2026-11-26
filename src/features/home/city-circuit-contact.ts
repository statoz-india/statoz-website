import * as THREE from 'three';
import { sweepBody, type CityBody, type CityContact } from './city-contact';

/** Circuit cars keep their laps, but stop safely when a visitor enters the track. */
export function createCircuitContact(cars: THREE.Group[], path: (angle: number) => THREE.Vector3) {
  const contacts: CityContact[] = [];
  const racers = cars.map((car, i) => {
    const angle = i * Math.PI * 2 / cars.length, p = path(angle), next = path(angle + .001);
    car.name = 'circuit-car-' + i; car.position.copy(p); car.rotation.y = Math.atan2(next.x - p.x, next.z - p.z);
    const body: CityBody = { id: car.name, kind: 'vehicle', x: p.x, z: p.z, y: p.y, radius: .65, halfLength: .925, heading: car.rotation.y, vx: 0, vz: 0 };
    const racer = { car, body, angle, speed: .14, hold: 0, impact: 0, distance: 0 };
    return racer;
  });
  function stop(racer: typeof racers[number], speed: number) {
    racer.hold = .75; racer.speed = 0; racer.body.vx = racer.body.vz = 0; racer.impact = Math.min(1, .15 + speed / 12);
  }
  return {
    bodies: () => racers.map(racer => racer.body),
    drainContacts: () => contacts.splice(0),
    distance: (car: THREE.Group) => racers.find(racer => racer.car === car)?.distance ?? 0,
    react(contact: CityContact) {
      const racer = racers.find(racer => racer.body.id === contact.id);
      if (racer) stop(racer, contact.speed);
    },
    update(dt: number, time: number, obstacles: readonly CityBody[]) {
      for (const racer of racers) {
        racer.hold = Math.max(0, racer.hold - dt); racer.impact = Math.max(0, racer.impact - dt * 2.4);
        racer.speed += ((racer.hold > 0 ? 0 : .14) - racer.speed) * Math.min(1, dt * 3);
        const angle = racer.angle + racer.speed * dt, destination = path(angle);
        const dx = destination.x - racer.body.x, dz = destination.z - racer.body.z;
        const body = { ...racer.body, vx: dt > 0 ? dx / dt : 0, vz: dt > 0 ? dz / dt : 0 };
        const hit = sweepBody(body, dx, dz, [...obstacles, ...racers.map(other => other.body)]);
        if (hit) {
          const fresh = racer.hold <= 0;
          stop(racer, hit.speed);
          if (fresh) {
            if (hit.id.startsWith('player-')) contacts.push({ ...hit, id: racer.body.id, kind: 'vehicle', nx: -hit.nx, nz: -hit.nz });
            else if (hit.id.startsWith('person-')) contacts.push({ ...hit, receiver: 'npc' });
          }
        } else {
          racer.angle = angle; racer.distance += Math.hypot(dx, dz);
          const tangent = path(angle + .001);
          Object.assign(racer.body, { x: destination.x, z: destination.z, heading: Math.atan2(tangent.x - destination.x, tangent.z - destination.z), vx: body.vx, vz: body.vz });
        }
        racer.car.position.set(racer.body.x, racer.body.y, racer.body.z);
        racer.car.rotation.set(0, racer.body.heading, Math.sin(time * 26) * racer.impact * .018);
      }
    },
  };
}
