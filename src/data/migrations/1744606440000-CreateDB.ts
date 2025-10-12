import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateDB1744606440000
 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // services
    await queryRunner.createTable(
      new Table({
        name: "services",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "name", type: "varchar", isUnique: true, isNullable: false },
          { name: "avg_process_time", type: "float", isNullable: false },
        ],
      }),
      true
    );

    // counters
    await queryRunner.createTable(
      new Table({
        name: "counters",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "name", type: "varchar", isUnique: true, isNullable: false },
        ],
      }),
      true
    );

    // services and counters many-to-many join table
    await queryRunner.createTable(
      new Table({
        name: "counters_services",
        columns: [
          { name: "counterId", type: "int", isPrimary: true },
          { name: "serviceId", type: "int", isPrimary: true },
        ],
      }),
      true
    );

    // Foreign key from counters_services to counters
    await queryRunner.createForeignKey(
      "counters_services",
      new TableForeignKey({
        columnNames: ["counterId"],
        referencedColumnNames: ["id"],
        referencedTableName: "counters",
        onDelete: "CASCADE",
      })
    );

    // Foreign key from counters_services to services
    await queryRunner.createForeignKey(
      "counters_services",
      new TableForeignKey({
        columnNames: ["serviceId"],
        referencedColumnNames: ["id"],
        referencedTableName: "services",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("counters_services");
    await queryRunner.dropTable("counters");
    await queryRunner.dropTable("services");
  }
}
