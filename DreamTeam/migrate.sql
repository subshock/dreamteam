IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE TABLE [AspNetRoles] (
        [Id] nvarchar(450) NOT NULL,
        [Name] nvarchar(256) NULL,
        [NormalizedName] nvarchar(256) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE TABLE [AspNetUsers] (
        [Id] nvarchar(450) NOT NULL,
        [UserName] nvarchar(256) NULL,
        [NormalizedUserName] nvarchar(256) NULL,
        [Email] nvarchar(256) NULL,
        [NormalizedEmail] nvarchar(256) NULL,
        [EmailConfirmed] bit NOT NULL,
        [PasswordHash] nvarchar(max) NULL,
        [SecurityStamp] nvarchar(max) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [PhoneNumber] nvarchar(max) NULL,
        [PhoneNumberConfirmed] bit NOT NULL,
        [TwoFactorEnabled] bit NOT NULL,
        [LockoutEnd] datetimeoffset NULL,
        [LockoutEnabled] bit NOT NULL,
        [AccessFailedCount] int NOT NULL,
        CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE TABLE [DeviceCodes] (
        [UserCode] nvarchar(200) NOT NULL,
        [DeviceCode] nvarchar(200) NOT NULL,
        [SubjectId] nvarchar(200) NULL,
        [SessionId] nvarchar(100) NULL,
        [ClientId] nvarchar(200) NOT NULL,
        [Description] nvarchar(200) NULL,
        [CreationTime] datetime2 NOT NULL,
        [Expiration] datetime2 NOT NULL,
        [Data] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_DeviceCodes] PRIMARY KEY ([UserCode])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE TABLE [PersistedGrants] (
        [Key] nvarchar(200) NOT NULL,
        [Type] nvarchar(50) NOT NULL,
        [SubjectId] nvarchar(200) NULL,
        [SessionId] nvarchar(100) NULL,
        [ClientId] nvarchar(200) NOT NULL,
        [Description] nvarchar(200) NULL,
        [CreationTime] datetime2 NOT NULL,
        [Expiration] datetime2 NULL,
        [ConsumedTime] datetime2 NULL,
        [Data] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_PersistedGrants] PRIMARY KEY ([Key])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE TABLE [AspNetRoleClaims] (
        [Id] int NOT NULL IDENTITY,
        [RoleId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE TABLE [AspNetUserClaims] (
        [Id] int NOT NULL IDENTITY,
        [UserId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE TABLE [AspNetUserLogins] (
        [LoginProvider] nvarchar(128) NOT NULL,
        [ProviderKey] nvarchar(128) NOT NULL,
        [ProviderDisplayName] nvarchar(max) NULL,
        [UserId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
        CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE TABLE [AspNetUserRoles] (
        [UserId] nvarchar(450) NOT NULL,
        [RoleId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
        CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE TABLE [AspNetUserTokens] (
        [UserId] nvarchar(450) NOT NULL,
        [LoginProvider] nvarchar(128) NOT NULL,
        [Name] nvarchar(128) NOT NULL,
        [Value] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
        CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL');
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL');
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE UNIQUE INDEX [IX_DeviceCodes_DeviceCode] ON [DeviceCodes] ([DeviceCode]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE INDEX [IX_DeviceCodes_Expiration] ON [DeviceCodes] ([Expiration]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE INDEX [IX_PersistedGrants_Expiration] ON [PersistedGrants] ([Expiration]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE INDEX [IX_PersistedGrants_SubjectId_ClientId_Type] ON [PersistedGrants] ([SubjectId], [ClientId], [Type]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    CREATE INDEX [IX_PersistedGrants_SubjectId_SessionId_Type] ON [PersistedGrants] ([SubjectId], [SessionId], [Type]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'00000000000000_CreateIdentitySchema')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'00000000000000_CreateIdentitySchema', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210829120129_AddDreamTeamEntities')
BEGIN
    CREATE TABLE [Seasons] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NULL,
        [State] int NOT NULL,
        [Budget] int NOT NULL,
        [Created] datetime2 NOT NULL,
        [Updated] datetime2 NULL,
        CONSTRAINT [PK_Seasons] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210829120129_AddDreamTeamEntities')
BEGIN
    CREATE TABLE [Players] (
        [Id] uniqueidentifier NOT NULL,
        [SeasonId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NULL,
        [Cost] int NOT NULL,
        [Created] datetime2 NOT NULL,
        [Updated] datetime2 NULL,
        CONSTRAINT [PK_Players] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Players_Seasons_SeasonId] FOREIGN KEY ([SeasonId]) REFERENCES [Seasons] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210829120129_AddDreamTeamEntities')
BEGIN
    CREATE TABLE [Teams] (
        [Id] uniqueidentifier NOT NULL,
        [SeasonId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NULL,
        [OwnerId] nvarchar(450) NULL,
        [Created] datetime2 NOT NULL,
        [Updated] datetime2 NULL,
        CONSTRAINT [PK_Teams] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Teams_AspNetUsers_OwnerId] FOREIGN KEY ([OwnerId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Teams_Seasons_SeasonId] FOREIGN KEY ([SeasonId]) REFERENCES [Seasons] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210829120129_AddDreamTeamEntities')
BEGIN
    CREATE TABLE [Trades] (
        [Id] uniqueidentifier NOT NULL,
        [PlayerId] uniqueidentifier NULL,
        [TeamId] uniqueidentifier NULL,
        [TradedIn] datetime2 NOT NULL,
        [TradedOut] datetime2 NULL,
        [Type] int NOT NULL,
        [Created] datetime2 NOT NULL,
        [Updated] datetime2 NULL,
        CONSTRAINT [PK_Trades] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Trades_Players_PlayerId] FOREIGN KEY ([PlayerId]) REFERENCES [Players] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Trades_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210829120129_AddDreamTeamEntities')
BEGIN
    CREATE INDEX [IX_Players_SeasonId] ON [Players] ([SeasonId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210829120129_AddDreamTeamEntities')
BEGIN
    CREATE INDEX [IX_Teams_OwnerId] ON [Teams] ([OwnerId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210829120129_AddDreamTeamEntities')
BEGIN
    CREATE INDEX [IX_Teams_SeasonId] ON [Teams] ([SeasonId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210829120129_AddDreamTeamEntities')
BEGIN
    CREATE INDEX [IX_Trades_PlayerId] ON [Trades] ([PlayerId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210829120129_AddDreamTeamEntities')
BEGIN
    CREATE INDEX [IX_Trades_TeamId] ON [Trades] ([TeamId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210829120129_AddDreamTeamEntities')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210829120129_AddDreamTeamEntities', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830094921_MoreDreamTeamEntities')
BEGIN
    ALTER TABLE [Seasons] ADD [AssistedWickets] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830094921_MoreDreamTeamEntities')
BEGIN
    ALTER TABLE [Seasons] ADD [Catches] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830094921_MoreDreamTeamEntities')
BEGIN
    ALTER TABLE [Seasons] ADD [Runouts] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830094921_MoreDreamTeamEntities')
BEGIN
    ALTER TABLE [Seasons] ADD [Runs] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830094921_MoreDreamTeamEntities')
BEGIN
    ALTER TABLE [Seasons] ADD [Stumpings] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830094921_MoreDreamTeamEntities')
BEGIN
    ALTER TABLE [Seasons] ADD [UnassistedWickets] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830094921_MoreDreamTeamEntities')
BEGIN
    CREATE TABLE [Rounds] (
        [Id] uniqueidentifier NOT NULL,
        [SeasonId] uniqueidentifier NOT NULL,
        [Name] int NOT NULL,
        [Created] datetime2 NOT NULL,
        [Updated] datetime2 NULL,
        CONSTRAINT [PK_Rounds] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Rounds_Seasons_SeasonId] FOREIGN KEY ([SeasonId]) REFERENCES [Seasons] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830094921_MoreDreamTeamEntities')
BEGIN
    CREATE TABLE [RoundPlayers] (
        [Id] uniqueidentifier NOT NULL,
        [RoundId] uniqueidentifier NOT NULL,
        [PlayerId] uniqueidentifier NOT NULL,
        [Runs] int NOT NULL,
        [UnassistedWickets] int NOT NULL,
        [AssistedWickets] int NOT NULL,
        [Catches] int NOT NULL,
        [Runouts] int NOT NULL,
        [Stumpings] int NOT NULL,
        [Created] datetime2 NOT NULL,
        [Updated] datetime2 NULL,
        CONSTRAINT [PK_RoundPlayers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_RoundPlayers_Players_PlayerId] FOREIGN KEY ([PlayerId]) REFERENCES [Players] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_RoundPlayers_Rounds_RoundId] FOREIGN KEY ([RoundId]) REFERENCES [Rounds] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830094921_MoreDreamTeamEntities')
BEGIN
    CREATE INDEX [IX_RoundPlayers_PlayerId] ON [RoundPlayers] ([PlayerId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830094921_MoreDreamTeamEntities')
BEGIN
    CREATE INDEX [IX_RoundPlayers_RoundId] ON [RoundPlayers] ([RoundId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830094921_MoreDreamTeamEntities')
BEGIN
    CREATE INDEX [IX_Rounds_SeasonId] ON [Rounds] ([SeasonId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830094921_MoreDreamTeamEntities')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210830094921_MoreDreamTeamEntities', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830104615_PlayerMultiplier')
BEGIN
    ALTER TABLE [Players] ADD [Multiplier] decimal(18,2) NOT NULL DEFAULT 0.0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830104615_PlayerMultiplier')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210830104615_PlayerMultiplier', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830105850_RoundComplete')
BEGIN
    ALTER TABLE [Rounds] ADD [Completed] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210830105850_RoundComplete')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210830105850_RoundComplete', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901114455_Transactions')
BEGIN
    DROP TABLE [Trades];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901114455_Transactions')
BEGIN
    ALTER TABLE [Teams] ADD [Valid] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901114455_Transactions')
BEGIN
    ALTER TABLE [Rounds] ADD [EndDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901114455_Transactions')
BEGIN
    ALTER TABLE [Rounds] ADD [StartDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901114455_Transactions')
BEGIN
    CREATE TABLE [Transactions] (
        [Id] uniqueidentifier NOT NULL,
        [Created] datetime2 NOT NULL,
        [TeamId] uniqueidentifier NULL,
        [Type] int NOT NULL,
        [PlayerId] uniqueidentifier NULL,
        [RoundId] uniqueidentifier NULL,
        [Amount] int NOT NULL,
        CONSTRAINT [PK_Transactions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Transactions_Players_PlayerId] FOREIGN KEY ([PlayerId]) REFERENCES [Players] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Transactions_Rounds_RoundId] FOREIGN KEY ([RoundId]) REFERENCES [Rounds] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Transactions_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901114455_Transactions')
BEGIN
    CREATE INDEX [IX_Transactions_PlayerId] ON [Transactions] ([PlayerId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901114455_Transactions')
BEGIN
    CREATE INDEX [IX_Transactions_RoundId] ON [Transactions] ([RoundId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901114455_Transactions')
BEGIN
    CREATE INDEX [IX_Transactions_TeamId] ON [Transactions] ([TeamId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901114455_Transactions')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210901114455_Transactions', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901115543_TeamBalance')
BEGIN
    ALTER TABLE [Teams] ADD [Balance] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901115543_TeamBalance')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210901115543_TeamBalance', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901115738_ApplicationUserName')
BEGIN
    ALTER TABLE [AspNetUsers] ADD [Name] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210901115738_ApplicationUserName')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210901115738_ApplicationUserName', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210903124759_FixSomeColumnTypes')
BEGIN
    DECLARE @var0 sysname;
    SELECT @var0 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Rounds]') AND [c].[name] = N'StartDate');
    IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Rounds] DROP CONSTRAINT [' + @var0 + '];');
    ALTER TABLE [Rounds] ALTER COLUMN [StartDate] datetimeoffset NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210903124759_FixSomeColumnTypes')
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Rounds]') AND [c].[name] = N'EndDate');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Rounds] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [Rounds] ALTER COLUMN [EndDate] datetimeoffset NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210903124759_FixSomeColumnTypes')
BEGIN
    DECLARE @var2 sysname;
    SELECT @var2 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Players]') AND [c].[name] = N'Multiplier');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Players] DROP CONSTRAINT [' + @var2 + '];');
    ALTER TABLE [Players] ALTER COLUMN [Multiplier] numeric(18,2) NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210903124759_FixSomeColumnTypes')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210903124759_FixSomeColumnTypes', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904052625_TeamOwner')
BEGIN
    ALTER TABLE [Teams] DROP CONSTRAINT [FK_Teams_AspNetUsers_OwnerId];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904052625_TeamOwner')
BEGIN
    EXEC sp_rename N'[Teams].[OwnerId]', N'UserId', N'COLUMN';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904052625_TeamOwner')
BEGIN
    EXEC sp_rename N'[Teams].[IX_Teams_OwnerId]', N'IX_Teams_UserId', N'INDEX';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904052625_TeamOwner')
BEGIN
    ALTER TABLE [Teams] ADD [Owner] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904052625_TeamOwner')
BEGIN
    ALTER TABLE [Teams] ADD [Paid] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904052625_TeamOwner')
BEGIN
    ALTER TABLE [Teams] ADD [PaymentId] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904052625_TeamOwner')
BEGIN
    ALTER TABLE [Teams] ADD CONSTRAINT [FK_Teams_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904052625_TeamOwner')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210904052625_TeamOwner', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904065459_SeasonCost')
BEGIN
    ALTER TABLE [Seasons] ADD [Cost] money NOT NULL DEFAULT 0.0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904065459_SeasonCost')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210904065459_SeasonCost', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904091401_DateTimeOffsets')
BEGIN
    DECLARE @var3 sysname;
    SELECT @var3 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transactions]') AND [c].[name] = N'Created');
    IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Transactions] DROP CONSTRAINT [' + @var3 + '];');
    ALTER TABLE [Transactions] ALTER COLUMN [Created] datetimeoffset NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904091401_DateTimeOffsets')
BEGIN
    DECLARE @var4 sysname;
    SELECT @var4 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Teams]') AND [c].[name] = N'Updated');
    IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [Teams] DROP CONSTRAINT [' + @var4 + '];');
    ALTER TABLE [Teams] ALTER COLUMN [Updated] datetimeoffset NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904091401_DateTimeOffsets')
BEGIN
    DECLARE @var5 sysname;
    SELECT @var5 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Teams]') AND [c].[name] = N'Created');
    IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [Teams] DROP CONSTRAINT [' + @var5 + '];');
    ALTER TABLE [Teams] ALTER COLUMN [Created] datetimeoffset NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904091401_DateTimeOffsets')
BEGIN
    DECLARE @var6 sysname;
    SELECT @var6 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Seasons]') AND [c].[name] = N'Updated');
    IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [Seasons] DROP CONSTRAINT [' + @var6 + '];');
    ALTER TABLE [Seasons] ALTER COLUMN [Updated] datetimeoffset NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904091401_DateTimeOffsets')
BEGIN
    DECLARE @var7 sysname;
    SELECT @var7 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Seasons]') AND [c].[name] = N'Created');
    IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [Seasons] DROP CONSTRAINT [' + @var7 + '];');
    ALTER TABLE [Seasons] ALTER COLUMN [Created] datetimeoffset NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904091401_DateTimeOffsets')
BEGIN
    DECLARE @var8 sysname;
    SELECT @var8 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Rounds]') AND [c].[name] = N'Updated');
    IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [Rounds] DROP CONSTRAINT [' + @var8 + '];');
    ALTER TABLE [Rounds] ALTER COLUMN [Updated] datetimeoffset NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904091401_DateTimeOffsets')
BEGIN
    DECLARE @var9 sysname;
    SELECT @var9 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Rounds]') AND [c].[name] = N'Created');
    IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [Rounds] DROP CONSTRAINT [' + @var9 + '];');
    ALTER TABLE [Rounds] ALTER COLUMN [Created] datetimeoffset NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904091401_DateTimeOffsets')
BEGIN
    DECLARE @var10 sysname;
    SELECT @var10 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoundPlayers]') AND [c].[name] = N'Updated');
    IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [RoundPlayers] DROP CONSTRAINT [' + @var10 + '];');
    ALTER TABLE [RoundPlayers] ALTER COLUMN [Updated] datetimeoffset NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904091401_DateTimeOffsets')
BEGIN
    DECLARE @var11 sysname;
    SELECT @var11 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RoundPlayers]') AND [c].[name] = N'Created');
    IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [RoundPlayers] DROP CONSTRAINT [' + @var11 + '];');
    ALTER TABLE [RoundPlayers] ALTER COLUMN [Created] datetimeoffset NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904091401_DateTimeOffsets')
BEGIN
    DECLARE @var12 sysname;
    SELECT @var12 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Players]') AND [c].[name] = N'Updated');
    IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [Players] DROP CONSTRAINT [' + @var12 + '];');
    ALTER TABLE [Players] ALTER COLUMN [Updated] datetimeoffset NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904091401_DateTimeOffsets')
BEGIN
    DECLARE @var13 sysname;
    SELECT @var13 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Players]') AND [c].[name] = N'Created');
    IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [Players] DROP CONSTRAINT [' + @var13 + '];');
    ALTER TABLE [Players] ALTER COLUMN [Created] datetimeoffset NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210904091401_DateTimeOffsets')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210904091401_DateTimeOffsets', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210905100105_Payments')
BEGIN
    EXEC sp_rename N'[Teams].[PaymentId]', N'RegistrationToken', N'COLUMN';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210905100105_Payments')
BEGIN
    CREATE TABLE [Payments] (
        [Id] uniqueidentifier NOT NULL,
        [TokenId] nvarchar(max) NULL,
        [Success] bit NOT NULL,
        [PaymentDetails] nvarchar(max) NULL,
        [Created] datetimeoffset NOT NULL,
        [Updated] datetimeoffset NULL,
        CONSTRAINT [PK_Payments] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210905100105_Payments')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210905100105_Payments', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210908093500_AddRoundPlayerPoints')
BEGIN
    ALTER TABLE [RoundPlayers] ADD [Points] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210908093500_AddRoundPlayerPoints')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210908093500_AddRoundPlayerPoints', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210909121202_TeamPlayersAndTradePeriods')
BEGIN
    CREATE TABLE [TradePeriods] (
        [Id] uniqueidentifier NOT NULL,
        [StartDate] datetimeoffset NOT NULL,
        [EndDate] datetimeoffset NOT NULL,
        [TradeLimit] int NOT NULL,
        [Created] datetimeoffset NOT NULL,
        [Updated] datetimeoffset NULL,
        CONSTRAINT [PK_TradePeriods] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210909121202_TeamPlayersAndTradePeriods')
BEGIN
    CREATE TABLE [TeamPlayers] (
        [Id] uniqueidentifier NOT NULL,
        [TeamId] uniqueidentifier NOT NULL,
        [PlayerId] uniqueidentifier NOT NULL,
        [Cost] int NOT NULL,
        [Type] int NOT NULL,
        [TradePeriodId] uniqueidentifier NULL,
        [Removed] bit NOT NULL,
        [Created] datetimeoffset NOT NULL,
        [Updated] datetimeoffset NULL,
        CONSTRAINT [PK_TeamPlayers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_TeamPlayers_Players_PlayerId] FOREIGN KEY ([PlayerId]) REFERENCES [Players] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_TeamPlayers_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_TeamPlayers_TradePeriods_TradePeriodId] FOREIGN KEY ([TradePeriodId]) REFERENCES [TradePeriods] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210909121202_TeamPlayersAndTradePeriods')
BEGIN
    CREATE INDEX [IX_TeamPlayers_PlayerId] ON [TeamPlayers] ([PlayerId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210909121202_TeamPlayersAndTradePeriods')
BEGIN
    CREATE INDEX [IX_TeamPlayers_TeamId] ON [TeamPlayers] ([TeamId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210909121202_TeamPlayersAndTradePeriods')
BEGIN
    CREATE INDEX [IX_TeamPlayers_TradePeriodId] ON [TeamPlayers] ([TradePeriodId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210909121202_TeamPlayersAndTradePeriods')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210909121202_TeamPlayersAndTradePeriods', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210910100817_TradePeriodSeason')
BEGIN
    ALTER TABLE [TradePeriods] ADD [SeasonId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210910100817_TradePeriodSeason')
BEGIN
    CREATE INDEX [IX_TradePeriods_SeasonId] ON [TradePeriods] ([SeasonId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210910100817_TradePeriodSeason')
BEGIN
    ALTER TABLE [TradePeriods] ADD CONSTRAINT [FK_TradePeriods_Seasons_SeasonId] FOREIGN KEY ([SeasonId]) REFERENCES [Seasons] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210910100817_TradePeriodSeason')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210910100817_TradePeriodSeason', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210911102455_TeamRoundResultRank')
BEGIN
    DROP TABLE [Transactions];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210911102455_TeamRoundResultRank')
BEGIN
    CREATE TABLE [TeamRoundRanks] (
        [Id] uniqueidentifier NOT NULL,
        [TeamId] uniqueidentifier NOT NULL,
        [RoundId] uniqueidentifier NOT NULL,
        [RoundRank] int NOT NULL,
        [SeasonRank] int NOT NULL,
        [Created] datetimeoffset NOT NULL,
        [Updated] datetimeoffset NULL,
        CONSTRAINT [PK_TeamRoundRanks] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_TeamRoundRanks_Rounds_RoundId] FOREIGN KEY ([RoundId]) REFERENCES [Rounds] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_TeamRoundRanks_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210911102455_TeamRoundResultRank')
BEGIN
    CREATE TABLE [TeamRoundResults] (
        [Id] uniqueidentifier NOT NULL,
        [TeamId] uniqueidentifier NOT NULL,
        [RoundId] uniqueidentifier NOT NULL,
        [Runs] int NOT NULL,
        [UnassistedWickets] int NOT NULL,
        [AssistedWickets] int NOT NULL,
        [Catches] int NOT NULL,
        [Runouts] int NOT NULL,
        [Stumpings] int NOT NULL,
        [Points] int NOT NULL,
        [Created] datetimeoffset NOT NULL,
        [Updated] datetimeoffset NULL,
        CONSTRAINT [PK_TeamRoundResults] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_TeamRoundResults_Rounds_RoundId] FOREIGN KEY ([RoundId]) REFERENCES [Rounds] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_TeamRoundResults_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210911102455_TeamRoundResultRank')
BEGIN
    CREATE INDEX [IX_TeamRoundRanks_RoundId] ON [TeamRoundRanks] ([RoundId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210911102455_TeamRoundResultRank')
BEGIN
    CREATE INDEX [IX_TeamRoundRanks_TeamId] ON [TeamRoundRanks] ([TeamId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210911102455_TeamRoundResultRank')
BEGIN
    CREATE INDEX [IX_TeamRoundResults_RoundId] ON [TeamRoundResults] ([RoundId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210911102455_TeamRoundResultRank')
BEGIN
    CREATE INDEX [IX_TeamRoundResults_TeamId] ON [TeamRoundResults] ([TeamId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210911102455_TeamRoundResultRank')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210911102455_TeamRoundResultRank', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210911113419_TaskLog')
BEGIN
    CREATE TABLE [TaskLogs] (
        [Id] int NOT NULL IDENTITY,
        [Timestamp] datetimeoffset NOT NULL,
        [TaskId] uniqueidentifier NOT NULL,
        [State] int NOT NULL,
        [Title] nvarchar(max) NULL,
        [Message] nvarchar(max) NULL,
        [Progress] int NULL,
        CONSTRAINT [PK_TaskLogs] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210911113419_TaskLog')
BEGIN
    CREATE INDEX [IX_TaskLogs_TaskId] ON [TaskLogs] ([TaskId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210911113419_TaskLog')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210911113419_TaskLog', N'5.0.9');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210912105815_TeamCaptains')
BEGIN
    DECLARE @var14 sysname;
    SELECT @var14 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TeamPlayers]') AND [c].[name] = N'Type');
    IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [TeamPlayers] DROP CONSTRAINT [' + @var14 + '];');
    ALTER TABLE [TeamPlayers] DROP COLUMN [Type];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210912105815_TeamCaptains')
BEGIN
    CREATE TABLE [TeamCaptains] (
        [Id] uniqueidentifier NOT NULL,
        [TeamId] uniqueidentifier NOT NULL,
        [TradePeriodId] uniqueidentifier NULL,
        [CaptainId] uniqueidentifier NOT NULL,
        [ViceCaptainId] uniqueidentifier NOT NULL,
        [Removed] bit NOT NULL,
        [Created] datetimeoffset NOT NULL,
        [Updated] datetimeoffset NULL,
        CONSTRAINT [PK_TeamCaptains] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_TeamCaptains_Players_CaptainId] FOREIGN KEY ([CaptainId]) REFERENCES [Players] ([Id]),
        CONSTRAINT [FK_TeamCaptains_Players_ViceCaptainId] FOREIGN KEY ([ViceCaptainId]) REFERENCES [Players] ([Id]),
        CONSTRAINT [FK_TeamCaptains_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]),
        CONSTRAINT [FK_TeamCaptains_TradePeriods_TradePeriodId] FOREIGN KEY ([TradePeriodId]) REFERENCES [TradePeriods] ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210912105815_TeamCaptains')
BEGIN
    CREATE INDEX [IX_TeamCaptains_CaptainId] ON [TeamCaptains] ([CaptainId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210912105815_TeamCaptains')
BEGIN
    CREATE INDEX [IX_TeamCaptains_TeamId] ON [TeamCaptains] ([TeamId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210912105815_TeamCaptains')
BEGIN
    CREATE INDEX [IX_TeamCaptains_TradePeriodId] ON [TeamCaptains] ([TradePeriodId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210912105815_TeamCaptains')
BEGIN
    CREATE INDEX [IX_TeamCaptains_ViceCaptainId] ON [TeamCaptains] ([ViceCaptainId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20210912105815_TeamCaptains')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20210912105815_TeamCaptains', N'5.0.9');
END;
GO

COMMIT;
GO

