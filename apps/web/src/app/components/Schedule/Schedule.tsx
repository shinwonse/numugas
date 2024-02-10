import { getSchedules } from '@numugas/util/crawlScheduleFromGameOne';

async function Schedule() {
  const schedules = await getSchedules();
  return <div>schedule</div>;
}

export default Schedule;
