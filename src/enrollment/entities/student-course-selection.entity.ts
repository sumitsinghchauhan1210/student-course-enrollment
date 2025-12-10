import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Student } from '../../student/entities/student.entity';
import { Course } from './course.entity';

@Table({ tableName: 'student_course_selections' })
export class StudentCourseSelection extends Model {
  @ForeignKey(() => Student)
  @Column({ field: 'student_id', type: DataType.BIGINT, allowNull: false })
  declare studentId: number;

  @ForeignKey(() => Course)
  @Column({ field: 'course_id', type: DataType.BIGINT, allowNull: false })
  declare courseId: number;

  @BelongsTo(() => Student, 'studentId')
  student: Student;

  @BelongsTo(() => Course, 'courseId')
  course: Course;
}
