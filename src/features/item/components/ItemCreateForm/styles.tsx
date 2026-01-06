import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
  },
 
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 10,
  },
  
  backButton: {
    padding: 8,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#1f2937",
    flex: 1, 
  },
  fieldContainer: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelIcon: {
    marginRight: 8, 
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb', 
    borderRadius: 12, 
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9fafb', 
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 6,
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    marginBottom: 30,
  },
  
  feeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  feeTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  feeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  feeSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  submitButton: {
    backgroundColor: '#0ea5e9', 
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  // Chỉnh sửa lại phần footer để icon và text nằm cùng hàng
  secureFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 19,
  },
  secureText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 4,
    marginTop: 8, // Khoảng cách với icon ổ khóa
  }
});