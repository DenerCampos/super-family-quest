import { AuthService } from "./auth";
import { CoinService } from "./coin";
import { CouponReaderService } from "./couponReader";
import { ExpenseService, type ExpenseRecurring } from "./expense";
import { FamilyGroupService } from "./familyGroup";
import { IntegrationsService } from "./integrations";
import { ProfileService } from "./profile";
import { ReportsService } from "./reports";
import { ResourcesService, type UpdateExpense } from "./resources";
import { RevenueService, type RevenueRecurring } from "./revenue";
import { ShoppingListService } from "./shoppingList";
import { themeService } from "./theme";
import { UserService } from "./user";
import { ChoreService } from "./chore";
import { RecipeService } from "./recipe";
import { MissionsService } from "./missions";

export const api = {
  getAvailableThemes: themeService.getAvailableThemes,
  getActiveTheme: themeService.getActiveTheme,
  changeTheme: themeService.changeTheme,
  createDefaultTheme: themeService.createDefaultTheme,
  getAllowedThemes: themeService.getAllowedThemes,
  buyTheme: themeService.buyTheme,

  profile: ProfileService.profile,
  completeProfile: ProfileService.completeProfile,
  getLatestRegistrations: (limit?: number) =>
    ProfileService.getLatestRegistrations(limit),
  getLatestRegistrationsPaginated: (page?: number, limit?: number) =>
    ProfileService.getLatestRegistrationsPaginated(page, limit),

  login: AuthService.login,
  register: UserService.register,
  updateUser: UserService.update,

  couponReader: CouponReaderService.read,
  expenseAnalyzeImage: ExpenseService.analyzeImage,
  expenseAnalyzeAudio: ExpenseService.analyzeAudio,
  revenueAnalyzeImage: RevenueService.analyzeImage,
  revenueAnalyzeAudio: RevenueService.analyzeAudio,

  getStores: ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => ResourcesService.getStores({ page, limit, search }),
  getPayments: ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => ResourcesService.getPayments({ page, limit, search }),
  getGroups: ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => ResourcesService.getGroups({ page, limit, search }),
  createStore: ResourcesService.createStore,
  createPayment: ResourcesService.createPayment,
  createGroup: ResourcesService.createGroup,
  createExpense: ResourcesService.createExpense,
  updateExpense: (id: string, data: UpdateExpense) =>
    ResourcesService.updateExpense(id, data),
  getExpenses: ({
    page,
    limit,
    search,
    isRecurring,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    isRecurring?: boolean;
  }) => ResourcesService.getExpenses({ page, limit, search, isRecurring }),
  updateStore: ({ id, name }: { id: string; name: string }) =>
    ResourcesService.updateStore({ id, name }),
  updatePayment: ({ id, name }: { id: string; name: string }) =>
    ResourcesService.updatePayment({ id, name }),
  updateGroup: ({ id, name }: { id: string; name: string }) =>
    ResourcesService.updateGroup({ id, name }),
  deleteStore: ({ id }: { id: string }) => ResourcesService.deleteStore({ id }),
  deletePayment: ({ id }: { id: string }) =>
    ResourcesService.deletePayment({ id }),
  deleteGroup: ({ id }: { id: string }) => ResourcesService.deleteGroup({ id }),
  deleteExpense: ({ id }: { id: string }) =>
    ResourcesService.deleteExpense({ id }),
  createRevenue: ResourcesService.createRevenue,
  getRevenues: ({
    page,
    limit,
    search,
    isRecurring,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    isRecurring?: boolean;
  }) => ResourcesService.getRevenues({ page, limit, search, isRecurring }),
  updateRevenue: ResourcesService.updateRevenue,
  deleteRevenue: ({ id }: { id: string }) =>
    ResourcesService.deleteRevenue({ id }),

  recurringIncomeConfirm: (revenues: RevenueRecurring) =>
    RevenueService.postRecurringConfirm(revenues),
  getIncomeRecurring: RevenueService.getRecurring,

  getExpenseByGroup: ({
    startDate,
    endDate,
    userId,
  }: {
    startDate: string;
    endDate: string;
    userId?: string;
  }) => ReportsService.getExpenseByGroup({ startDate, endDate, userId }),
  getExpenseByStore: ({
    startDate,
    endDate,
    userId,
  }: {
    startDate: string;
    endDate: string;
    userId?: string;
  }) => ReportsService.getExpenseByStore({ startDate, endDate, userId }),
  getExpenseByDate: ({
    startDate,
    endDate,
    userId,
  }: {
    startDate: string;
    endDate: string;
    userId?: string;
  }) => ReportsService.getExpenseByDate({ startDate, endDate, userId }),
  getMostPurchasedItems: ({
    startDate,
    endDate,
    userId,
  }: {
    startDate: string;
    endDate: string;
    userId?: string;
  }) => ReportsService.getMostPurchasedItems({ startDate, endDate, userId }),
  getExpensesIncomeComparison: ({
    year,
    userId,
  }: {
    year: string;
    userId?: string;
  }) => ReportsService.getExpensesIncomeComparison({ year, userId }),
  recurringExpenseConfirm: (expenses: ExpenseRecurring) =>
    ExpenseService.postRecurringConfirm(expenses),
  getExpenseRecurring: ExpenseService.getRecurring,
  getExpenseById: (id: string) => ExpenseService.getExpenseById(id),

  getBalanceCoin: CoinService.getBalanceCoin,

  getRevenueById: (id: string) => RevenueService.getRevenueById(id),

  uploadProfileImage: (file: File) => ProfileService.uploadImage(file),

  familyGroupCreate: (name: string) => FamilyGroupService.create(name),
  familyGroupList: () => FamilyGroupService.list(),
  familyGroupGetById: (id: string) => FamilyGroupService.getById(id),
  familyGroupUpdate: (id: string, name: string) => FamilyGroupService.update(id, name),
  familyGroupDelete: (id: string) => FamilyGroupService.delete(id),
  familyGroupInvite: (groupId: string, email: string) =>
    FamilyGroupService.invite(groupId, email),
  familyGroupListInvitations: () => FamilyGroupService.listInvitations(),
  familyGroupAcceptInvitation: (invitationId: string) =>
    FamilyGroupService.acceptInvitation(invitationId),
  familyGroupRejectInvitation: (invitationId: string) =>
    FamilyGroupService.rejectInvitation(invitationId),
  familyGroupListMembers: (groupId: string) =>
    FamilyGroupService.listMembers(groupId),
  familyGroupChangeRole: (
    groupId: string,
    memberId: string,
    role: 'admin' | 'member',
  ) => FamilyGroupService.changeRole(groupId, memberId, role),
  familyGroupRemoveMember: (groupId: string, memberId: string) =>
    FamilyGroupService.removeMember(groupId, memberId),
  familyGroupLeave: (groupId: string) => FamilyGroupService.leaveGroup(groupId),
  familyGroupGetSummary: (groupId: string, month: number, year: number) =>
    FamilyGroupService.getSummary(groupId, month, year),
  familyGroupGetMemberData: (
    groupId: string,
    memberId: string,
    month: number,
    year: number,
  ) => FamilyGroupService.getMemberData(groupId, memberId, month, year),

  getShoppingLists: ShoppingListService.getShoppingLists,
  createShoppingList: ShoppingListService.createShoppingList,
  getShoppingListDetail: ShoppingListService.getShoppingListDetail,
  updateShoppingList: ShoppingListService.updateShoppingList,
  deleteShoppingList: ShoppingListService.deleteShoppingList,
  completeShoppingList: ShoppingListService.completeShoppingList,
  addShoppingListItem: ShoppingListService.addItem,
  updateShoppingListItem: ShoppingListService.updateItem,
  toggleShoppingListItem: ShoppingListService.toggleItem,
  removeShoppingListItem: ShoppingListService.removeItem,
  getShoppingListSuggestions: ShoppingListService.getSuggestions,

  listRecipes: RecipeService.list,
  getRecipeById: RecipeService.getById,
  createRecipe: RecipeService.create,
  updateRecipe: RecipeService.update,
  deleteRecipe: RecipeService.remove,
  uploadRecipePhoto: RecipeService.uploadPhoto,
  removeRecipePhoto: RecipeService.removePhoto,
  generateRecipeShoppingList: RecipeService.generateShoppingList,

  getIntegrationsStatus: IntegrationsService.getStatus,
  alexaOAuthLogin: IntegrationsService.alexaOAuthLogin,
  unlinkAlexa: IntegrationsService.unlinkAlexa,

  choreListDefinitions: ChoreService.listDefinitions,
  choreCreateDefinition: ChoreService.createDefinition,
  choreUpdateDefinition: ChoreService.updateDefinition,
  choreDeleteDefinition: ChoreService.deleteDefinition,
  choreListOccurrences: ChoreService.listOccurrences,
  choreListPendingApproval: ChoreService.listPendingApproval,
  choreListMine: ChoreService.listMine,
  choreListHistory: ChoreService.listHistory,
  choreResolveOccurrence: ChoreService.resolveOccurrence,
  choreStartOccurrence: ChoreService.startOccurrence,
  choreUploadOccurrencePhotos: ChoreService.uploadOccurrencePhotos,
  choreSubmitOccurrence: ChoreService.submitOccurrence,
  choreApproveOccurrence: ChoreService.approveOccurrence,
  choreRejectOccurrence: ChoreService.rejectOccurrence,
  choreGetPayrollSuggestion: ChoreService.getPayrollSuggestion,
  choreGetPayrollPending: ChoreService.getPayrollPending,
  choreSettlePayroll: ChoreService.settlePayroll,

  missionGetAll: MissionsService.getMissions,
  missionClaimReward: MissionsService.claimReward,
};
