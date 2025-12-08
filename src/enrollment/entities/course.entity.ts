import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';
import { College } from '../../college/entities/college.entity';
import { CourseTimetable } from './course-timetable.entity';
import { StudentCourseSelection } from './student-course-selection.entity';

@Table({ tableName: 'courses' })
export class Course extends Model {
  @Column({ allowNull: false })
  code: string;

  @Column({ allowNull: false })
  title: string;

  @ForeignKey(() => College)
  @Column({ field: 'college_id', type: DataType.BIGINT, allowNull: false })
  collegeId: number;

  @BelongsTo(() => College)
  college: College;

  @HasMany(() => CourseTimetable)
  timetables: CourseTimetable[];

  @HasMany(() => StudentCourseSelection, 'courseId')
  selections: StudentCourseSelection[];
}
