import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Course } from './course.entity';

@Table({ tableName: 'course_timetables' })
export class CourseTimetable extends Model {
  @ForeignKey(() => Course)
  @Column({ field: 'course_id', type: DataType.BIGINT, allowNull: false })
  declare courseId: number;

  @Column({
    field: 'day_of_week',
    type: DataType.SMALLINT,
    allowNull: false,
  })
  declare dayOfWeek: number; // 1=Monday ... 7=Sunday

  @Column({ type: DataType.TIME, allowNull: false })
  declare startTime: string;

  @Column({ type: DataType.TIME, allowNull: false })
  declare endTime: string;

  @BelongsTo(() => Course)
  course: Course;
}
