import { getSchedules } from '@numugas/util/crawlScheduleFromGameOne';

async function Schedule() {
  const schedules = await getSchedules();
  console.log(schedules);
  return <div>schedule</div>;
}

export default Schedule;
