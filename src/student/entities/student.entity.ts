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
import { StudentCourseSelection } from 'src/enrollment/entities/student-course-selection.entity';

@Table({ tableName: 'students' })
export class Student extends Model {
  @Column({ allowNull: false })
  name: string;

  @ForeignKey(() => College) // ✅ FIX: Explicit foreign key
  @Column({
    field: 'college_id',
    type: DataType.BIGINT,
    allowNull: false,
  })
  collegeId: number;

  @BelongsTo(() => College)
  college: College;

  @HasMany(() => StudentCourseSelection, 'studentId')
  courseSelections: StudentCourseSelection[];
}
